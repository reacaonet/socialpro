import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { BsFacebook, BsInstagram, BsTwitter, BsLinkedin, BsClock, BsCheckCircle, BsXCircle } from 'react-icons/bs';

export default function PostList() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Cria a query para buscar os posts do usuário
    const postsQuery = query(
      collection(db, 'posts'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    // Inscreve para atualizações em tempo real
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        scheduledFor: doc.data().scheduledFor?.toDate()
      }));
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const platformIcons = {
    facebook: BsFacebook,
    instagram: BsInstagram,
    twitter: BsTwitter,
    linkedin: BsLinkedin
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Seus Posts
      </h2>

      <div className="space-y-4 sm:space-y-6">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Você ainda não criou nenhum post
          </p>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="border rounded-lg p-3 sm:p-4 space-y-3"
              >
                {/* Conteúdo do post */}
                <p className="text-gray-800 text-sm sm:text-base">{post.content}</p>

                {/* Imagens do post */}
                {post.images && post.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {post.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Post image ${index + 1}`}
                        className="w-full h-32 sm:h-40 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}

                {/* Status e data */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                  {post.status === 'scheduled' ? (
                    <div className="flex items-center gap-1">
                      <BsClock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Agendado para {formatDate(post.scheduledFor)}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <BsCheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                      <span>Publicado em {formatDate(post.createdAt)}</span>
                    </div>
                  )}
                </div>

                {/* Plataformas */}
                <div className="flex flex-wrap gap-2">
                  {Object.entries(post.platforms).map(([platform, status]) => {
                    const Icon = platformIcons[platform];
                    return status ? (
                      <div
                        key={platform}
                        className="flex items-center gap-1 text-xs sm:text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                      >
                        <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="capitalize">{platform}</span>
                        {post.platformStatus?.[platform] === 'error' ? (
                          <BsXCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                        ) : post.platformStatus?.[platform] === 'success' ? (
                          <BsCheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                        ) : null}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
