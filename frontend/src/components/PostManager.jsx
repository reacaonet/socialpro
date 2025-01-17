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
  BsHash,
  BsXCircle
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Criar Post
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Área de texto do post */}
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="O que você quer compartilhar?"
            className="w-full min-h-[120px] p-3 sm:p-4 border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <div className="absolute right-2 bottom-2 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <BsEmojiSmile className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </button>
          </div>
          {showEmojiPicker && (
            <div className="absolute right-0 bottom-12 z-10">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>

        {/* Preview de imagens */}
        {imageURLs.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {imageURLs.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <BsXCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Barra de ferramentas */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <BsImage className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Imagens</span>
          </button>

          <button
            type="button"
            onClick={() => {/* Implementar funcionalidade */}}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <BsLink45Deg className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Link</span>
          </button>

          <button
            type="button"
            onClick={() => {/* Implementar funcionalidade */}}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <BsGeoAlt className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Localização</span>
          </button>

          <button
            type="button"
            onClick={() => {/* Implementar funcionalidade */}}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <BsHash className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Hashtags</span>
          </button>
        </div>

        {/* Seleção de plataformas */}
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {Object.entries(selectedPlatforms).map(([platform, selected]) => {
            const Icon = {
              facebook: BsFacebook,
              instagram: BsInstagram,
              twitter: BsTwitter,
              linkedin: BsLinkedin
            }[platform];

            return (
              <button
                key={platform}
                type="button"
                onClick={() => handlePlatformToggle(platform)}
                className={`
                  flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm
                  transition-colors
                  ${selected
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="capitalize">{platform}</span>
              </button>
            );
          })}
        </div>

        {/* Agendamento */}
        <div className="flex items-center gap-2 sm:gap-4">
          <BsClock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          <input
            type="datetime-local"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Botão de publicar */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`
              px-4 py-2 rounded-lg text-white text-sm sm:text-base font-medium
              ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-dark'
              }
            `}
          >
            {loading ? 'Publicando...' : 'Publicar'}
          </button>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
