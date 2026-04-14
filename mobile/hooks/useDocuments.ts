import { useState } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { createApiClient } from '@/lib/api';
import { UploadedDocument, ExtractedEntry } from '@/types';

export function useDocuments() {
  const { getToken } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractedEntries, setExtractedEntries] = useState<ExtractedEntry[]>([]);
  const [uploadedDoc, setUploadedDoc] = useState<UploadedDocument | null>(null);
  const [error, setError] = useState<string | null>(null);

  const api = createApiClient(getToken);

  const uploadDocument = async (file: { uri: string; name: string; type: string }) => {
    setUploading(true);
    setError(null);
    try {
      const doc = await api.uploadDocument(file);
      setUploadedDoc(doc);
      return doc;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setUploading(false);
    }
  };

  const extractDocument = async (documentId: string, type: 'pdf' | 'image') => {
    setExtracting(true);
    setError(null);
    try {
      const entries = await api.extractDocument(documentId, type);
      setExtractedEntries(entries);
      return entries;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setExtracting(false);
    }
  };

  const deleteDocument = async (id: string) => {
    await api.deleteDocument(id);
    if (uploadedDoc?.id === id) setUploadedDoc(null);
  };

  const clearExtraction = () => {
    setExtractedEntries([]);
    setUploadedDoc(null);
  };

  return {
    uploading,
    extracting,
    extractedEntries,
    uploadedDoc,
    error,
    uploadDocument,
    extractDocument,
    deleteDocument,
    clearExtraction,
  };
}
