import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { toast } from 'react-hot-toast';
import * as yup from 'yup';

// Schema de validação
export const companySchema = yup.object().shape({
  name: yup
    .string()
    .required('Nome da empresa é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  website: yup
    .string()
    .url('Website deve ser uma URL válida')
    .nullable(),
  industry: yup
    .string()
    .required('Setor/Indústria é obrigatório')
    .min(2, 'Setor deve ter pelo menos 2 caracteres')
    .max(50, 'Setor deve ter no máximo 50 caracteres'),
  size: yup
    .string()
    .required('Tamanho da empresa é obrigatório')
    .oneOf(['1-10', '11-50', '51-200', '201-500', '501+'], 'Selecione um tamanho válido'),
  description: yup
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .nullable(),
});

export function useCompany(userId) {
  const [companyData, setCompanyData] = useState({
    name: '',
    website: '',
    industry: '',
    size: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadCompanyData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const userDoc = await getDoc(doc(db, 'users', userId));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.company) {
            setCompanyData(prev => ({
              ...prev,
              ...userData.company
            }));
          }
        }
      } catch (error) {
        console.error('Error loading company data:', error);
        toast.error('Erro ao carregar dados da empresa');
      } finally {
        setLoading(false);
      }
    };

    loadCompanyData();
  }, [userId]);

  const validateField = async (name, value) => {
    try {
      await yup.reach(companySchema, name).validate(value);
      setErrors(prev => ({ ...prev, [name]: undefined }));
      return true;
    } catch (error) {
      setErrors(prev => ({ ...prev, [name]: error.message }));
      return false;
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
    await validateField(name, value);
  };

  const saveCompany = async () => {
    try {
      // Validar todos os campos
      await companySchema.validate(companyData, { abortEarly: false });
      setErrors({});

      setLoading(true);
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        company: companyData
      });
      toast.success('Dados da empresa atualizados com sucesso!');
      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach(err => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
        toast.error('Por favor, corrija os erros no formulário');
      } else {
        console.error('Error updating company data:', error);
        toast.error('Erro ao atualizar dados da empresa');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    companyData,
    loading,
    errors,
    handleChange,
    saveCompany
  };
}
