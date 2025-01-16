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

      {posts.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          Você ainda não criou nenhum post
        </p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border rounded-lg p-4 space-y-3"
            >
              {/* Conteúdo do post */}
              <p className="text-gray-800">{post.content}</p>

              {/* Status e data */}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {post.status === 'scheduled' ? (
                  <div className="flex items-center space-x-1">
                    <BsClock className="w-4 h-4" />
                    <span>Agendado para {formatDate(post.scheduledFor)}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <BsCheckCircle className="w-4 h-4 text-green-500" />
                    <span>Publicado em {formatDate(post.createdAt)}</span>
                  </div>
                )}
              </div>

              {/* Plataformas e status */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(post.platforms)
                  .filter(([_, selected]) => selected)
                  .map(([platform]) => {
                    const Icon = platformIcons[platform];
                    const response = post.platformResponses?.[platform];
                    
                    return (
                      <div
                        key={platform}
                        className={`
                          flex items-center space-x-1 px-2 py-1 rounded-full text-sm
                          ${response?.success
                            ? 'bg-green-100 text-green-800'
                            : response?.error
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'}
                        `}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="capitalize">{platform}</span>
                        {response && (
                          response.success
                            ? <BsCheckCircle className="w-4 h-4 text-green-500" />
                            : <BsXCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
