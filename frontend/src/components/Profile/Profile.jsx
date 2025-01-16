import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { BsCamera } from 'react-icons/bs';

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    bio: '',
    company: '',
    website: '',
    location: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const storage = getStorage();
      const photoRef = ref(storage, `profile-photos/${user.uid}`);
      await uploadBytes(photoRef, file);
      const photoURL = await getDownloadURL(photoRef);
      
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        photoURL
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error uploading photo:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, formData);
      setLoading(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setLoading(false);
    }
  };

  return (
    <div className="pl-64 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Seu Perfil
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie suas informações pessoais e como elas são exibidas para outros usuários.
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Perfil</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Estas informações serão exibidas publicamente, então tome cuidado com o que você compartilha.
                </p>
              </div>
            </div>

            <div className="mt-5 md:mt-0 md:col-span-2">
              <form onSubmit={handleSubmit}>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    {/* Foto do Perfil */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Foto</label>
                      <div className="mt-1 flex items-center space-x-5">
                        <div className="relative">
                          <div className="relative rounded-full overflow-hidden h-32 w-32 bg-gray-100">
                            {user?.photoURL ? (
                              <img
                                src={user.photoURL}
                                alt={user.displayName || 'Profile'}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-400 text-2xl">
                                {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                              </div>
                            )}
                          </div>
                          <label
                            htmlFor="photo-upload"
                            className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-primary text-white shadow-lg flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-colors duration-200"
                          >
                            <BsCamera className="h-4 w-4" />
                            <input
                              id="photo-upload"
                              name="photo"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handlePhotoUpload}
                            />
                          </label>
                        </div>
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-primary text-sm font-medium rounded-md text-primary hover:bg-primary hover:text-white transition-colors duration-200"
                        >
                          Alterar Foto
                        </button>
                      </div>
                    </div>

                    {/* Nome */}
                    <div>
                      <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                        Nome
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="displayName"
                          id="displayName"
                          value={formData.displayName}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md transition-shadow duration-200"
                          placeholder="Seu nome completo"
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="bio"
                          name="bio"
                          rows={3}
                          value={formData.bio}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md transition-shadow duration-200"
                          placeholder="Conte um pouco sobre você..."
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Breve descrição sobre você ou sua empresa.
                      </p>
                    </div>

                    {/* Empresa */}
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                        Empresa
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="company"
                          id="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    {/* Website */}
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                        Website
                      </label>
                      <div className="mt-1">
                        <input
                          type="url"
                          name="website"
                          id="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    {/* Localização */}
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Localização
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="location"
                          id="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    {/* Telefone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Telefone
                      </label>
                      <div className="mt-1">
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Salvando...
                        </>
                      ) : 'Salvar Alterações'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
