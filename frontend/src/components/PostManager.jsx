import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, collection, addDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebase';
import { createTweet } from '../services/twitter';
import { createLinkedInPost } from '../services/linkedin';
import { 
  BsFacebook, 
  BsInstagram, 
  BsTwitter, 
  BsLinkedin, 
  BsClock,
  BsImage,
  BsLink45Deg,
  BsEmojiSmile,
  BsGeoAlt,
  BsHash
} from 'react-icons/bs';
import EmojiPicker from 'emoji-picker-react';

export default function PostManager() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  
  // Estados para o conteúdo do post
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [imageURLs, setImageURLs] = useState([]);
  const [link, setLink] = useState('');
  const [location, setLocation] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Estados para plataformas e agendamento
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    facebook: false,
    instagram: false,
    twitter: false,
    linkedin: false
  });
  const [schedule, setSchedule] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados para conteúdo específico de cada plataforma
  const [platformSpecificContent, setPlatformSpecificContent] = useState({
    facebook: { content: '' },
    instagram: { content: '' },
    twitter: { content: '' },
    linkedin: { content: '' }
  });

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);

    // Cria URLs temporárias para preview
    const urls = files.map(file => URL.createObjectURL(file));
    setImageURLs(prev => [...prev, ...urls]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageURLs(prev => prev.filter((_, i) => i !== index));
  };

  const handleEmojiClick = (emojiData) => {
    setContent(prev => prev + emojiData.emoji);
  };

  const uploadImages = async () => {
    const uploadedUrls = [];
    
    for (const image of images) {
      const storageRef = ref(storage, `posts/${user.uid}/${Date.now()}-${image.name}`);
      await uploadBytes(storageRef, image);
      const url = await getDownloadURL(storageRef);
      uploadedUrls.push(url);
    }

    return uploadedUrls;
  };

  const handlePlatformContentChange = (platform, value) => {
    setPlatformSpecificContent(prev => ({
      ...prev,
      [platform]: { ...prev[platform], content: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Verifica se pelo menos uma plataforma foi selecionada
      if (!Object.values(selectedPlatforms).some(Boolean)) {
        throw new Error('Selecione pelo menos uma rede social');
      }

      // Upload das imagens
      const imageUrls = await uploadImages();

      // Obtém as informações das conexões do usuário
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      const { socialAccounts } = userData;

      // Prepara o post para salvar no Firestore
      const post = {
        content,
        images: imageUrls,
        link,
        location,
        hashtags: hashtags.split(' ').filter(Boolean),
        platforms: selectedPlatforms,
        platformSpecificContent,
        userId: user.uid,
        createdAt: new Date(),
        scheduledFor: schedule ? new Date(schedule) : null,
        status: schedule ? 'scheduled' : 'published',
        platformResponses: {}
      };

      // Se não estiver agendado, posta imediatamente
      if (!schedule) {
        // Posta no Twitter
        if (selectedPlatforms.twitter && socialAccounts?.twitter) {
          try {
            const tweetContent = platformSpecificContent.twitter.content || content;
            const tweetResponse = await createTweet(
              socialAccounts.twitter.accessToken,
              `${tweetContent} ${hashtags} ${link}`
            );
            post.platformResponses.twitter = {
              success: true,
              postId: tweetResponse.id
            };
          } catch (error) {
            console.error('Error posting to Twitter:', error);
            post.platformResponses.twitter = {
              success: false,
              error: error.message
            };
          }
        }

        // Posta no LinkedIn
        if (selectedPlatforms.linkedin && socialAccounts?.linkedin) {
          try {
            const linkedinContent = platformSpecificContent.linkedin.content || content;
            const linkedinResponse = await createLinkedInPost(
              socialAccounts.linkedin.accessToken,
              `${linkedinContent} ${hashtags} ${link}`
            );
            post.platformResponses.linkedin = {
              success: true,
              postId: linkedinResponse.id
            };
          } catch (error) {
            console.error('Error posting to LinkedIn:', error);
            post.platformResponses.linkedin = {
              success: false,
              error: error.message
            };
          }
        }
      }

      // Salva o post no Firestore
      await addDoc(collection(db, 'posts'), post);

      // Limpa o formulário
      setContent('');
      setImages([]);
      setImageURLs([]);
      setLink('');
      setLocation('');
      setHashtags('');
      setPlatformSpecificContent({
        facebook: { content: '' },
        instagram: { content: '' },
        twitter: { content: '' },
        linkedin: { content: '' }
      });
      setSelectedPlatforms({
        facebook: false,
        instagram: false,
        twitter: false,
        linkedin: false
      });
      setSchedule('');
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const platforms = [
    {
      name: 'facebook',
      icon: BsFacebook,
      label: 'Facebook',
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700'
    },
    {
      name: 'instagram',
      icon: BsInstagram,
      label: 'Instagram',
      color: 'bg-pink-600',
      hoverColor: 'hover:bg-pink-700'
    },
    {
      name: 'twitter',
      icon: BsTwitter,
      label: 'Twitter',
      color: 'bg-sky-500',
      hoverColor: 'hover:bg-sky-600'
    },
    {
      name: 'linkedin',
      icon: BsLinkedin,
      label: 'LinkedIn',
      color: 'bg-blue-700',
      hoverColor: 'hover:bg-blue-800'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Criar Post
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Área principal de conteúdo */}
        <div className="space-y-4">
          {/* Campo de texto principal */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Conteúdo
            </label>
            <div className="mt-1 relative">
              <textarea
                id="content"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="O que você quer compartilhar?"
                required
              />
              <div className="absolute bottom-2 right-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-white bg-primary hover:bg-primary-dark rounded-full transition-colors duration-200"
                >
                  <BsImage className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-white bg-primary hover:bg-primary-dark rounded-full transition-colors duration-200"
                >
                  <BsEmojiSmile className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute z-10">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}

          {/* Preview de imagens */}
          {imageURLs.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageURLs.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input de arquivo oculto */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            multiple
            accept="image/*"
            className="hidden"
          />

          {/* Link */}
          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-700">
              <div className="flex items-center space-x-2">
                <BsLink45Deg className="w-5 h-5" />
                <span>Link</span>
              </div>
            </label>
            <input
              type="url"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="https://"
            />
          </div>

          {/* Localização */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              <div className="flex items-center space-x-2">
                <BsGeoAlt className="w-5 h-5" />
                <span>Localização</span>
              </div>
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="Adicionar localização"
            />
          </div>

          {/* Hashtags */}
          <div>
            <label htmlFor="hashtags" className="block text-sm font-medium text-gray-700">
              <div className="flex items-center space-x-2">
                <BsHash className="w-5 h-5" />
                <span>Hashtags</span>
              </div>
            </label>
            <input
              type="text"
              id="hashtags"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="#exemplo #hashtag"
            />
          </div>
        </div>

        {/* Seleção de plataformas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione as redes sociais
          </label>
          <div className="grid grid-cols-2 gap-4">
            {platforms.map((platform) => (
              <button
                key={platform.name}
                type="button"
                onClick={() => handlePlatformToggle(platform.name)}
                className={`
                  flex items-center justify-center space-x-2 px-4 py-2 rounded-lg
                  transition-all duration-200
                  ${selectedPlatforms[platform.name]
                    ? platform.color + ' text-white'
                    : 'bg-gray-100 text-gray-600 ' + platform.hoverColor.replace('hover:', 'hover:text-white')}
                `}
              >
                <platform.icon className="w-5 h-5" />
                <span>{platform.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo específico para cada plataforma */}
        {Object.entries(selectedPlatforms)
          .filter(([_, selected]) => selected)
          .map(([platform]) => (
            <div key={platform}>
              <label className="block text-sm font-medium text-gray-700">
                Conteúdo específico para {platform}
              </label>
              <textarea
                rows={2}
                value={platformSpecificContent[platform].content}
                onChange={(e) => handlePlatformContentChange(platform, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder={`Deixe em branco para usar o conteúdo principal`}
              />
            </div>
          ))}

        {/* Agendamento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <BsClock className="w-5 h-5" />
              <span>Agendar post</span>
            </div>
          </label>
          <input
            type="datetime-local"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Botão de submit */}
        <button
          type="submit"
          disabled={loading}
          className={`
            w-full flex items-center justify-center px-4 py-2 border border-transparent
            rounded-md shadow-sm text-base font-medium text-white bg-primary
            hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2
            focus:ring-primary transition-colors duration-200
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {loading ? 'Publicando...' : schedule ? 'Agendar Post' : 'Publicar Agora'}
        </button>
      </form>
    </div>
  );
}
