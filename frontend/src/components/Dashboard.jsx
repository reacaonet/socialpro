import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import AuthNavbar from './Navigation/AuthNavbar';
import Sidebar from './Navigation/Sidebar';
import Footer from './Navigation/Footer';
import PostManager from './PostManager';
import PostList from './PostList';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const postsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleCreatePost = async () => {
    if (!postContent.trim()) return;

    try {
      await addDoc(collection(db, 'posts'), {
        content: postContent,
        userEmail: user.email,
        userId: user.uid,
        createdAt: new Date().toISOString()
      });
      setPostContent('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
      <Sidebar />
      
      {/* Main Content */}
      <div className="pl-64 pt-16"> {/* Ajustado para o espaço da Sidebar e Navbar */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="grid grid-cols-1 gap-6">
                <PostManager />
                <PostList />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
