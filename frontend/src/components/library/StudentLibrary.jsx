import React, { useEffect, useState } from 'react';
import { assetService } from '../../services/assetService';
import AssetCard from './AssetCard';
import AssetSkeleton from './AssetSkeleton';
import SearchBar from './SearchBar'; 
import FilePreview from './FilePreview'; 
import { toast } from 'react-hot-toast';

const StudentLibrary = ({ activeTag = 'All' }) => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedFile, setSelectedFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // --- 🔄 FIX 1: Safe Data Extraction to prevent M.map error ---
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await assetService.fetchAssets(currentFolder);
        
        // Ensure data is always an array, even if nested in an object
        const dataArray = Array.isArray(response) 
          ? response 
          : (response?.assets || response?.data || []);
        
        setAssets(dataArray);
        setFilteredAssets(dataArray);
      } catch (err) { 
        console.error("Fetch error:", err);
        toast.error("Error loading library"); 
        setAssets([]); // Reset to empty array on error
      }
      setLoading(false);
    };
    load();
  }, [currentFolder]);

  // --- 🔍 FIX 2: Safe Filtering with Array Guard ---
  useEffect(() => {
    if (!Array.isArray(assets)) return; // Don't filter if not an array

    let temp = [...assets];

    if (activeTag !== 'All') {
      temp = temp.filter(a => a.category === activeTag);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      temp = temp.filter(a => 
        (a.title || "").toLowerCase().includes(term)
      );
    }
    
    setFilteredAssets(temp);
  }, [searchTerm, activeTag, assets]);

  const handleAction = (asset) => {
    if (asset.type === 'folder') {
      setCurrentFolder(asset._id);
    } else {
      if (asset.price > 0) {
        toast.success("Checkout system coming soon!", { icon: '💳' });
      } else {
        // Safe URL cleaning for Lifestyle fashion store assets
        let cleanUrl = (asset.fileUrl || "").replace("http://", "https://");
        
        if (cleanUrl.includes("upload/")) {
            cleanUrl = cleanUrl.replace("/upload/f_auto,q_auto/", "/upload/");
        }

        setSelectedFile({ ...asset, fileUrl: cleanUrl });
        setIsPreviewOpen(true);
      }
    }
  };

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="max-w-3xl mx-auto mb-16">
          <SearchBar 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
            placeholder={`Search in ${currentFolder ? 'this folder' : 'all resources'}...`}
          />
        </div>

        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
            {currentFolder ? '📁 Folder Content' : '📚 All Resources'}
          </h2>
          {currentFolder && (
            <button 
              onClick={() => setCurrentFolder(null)}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black hover:bg-blue-700 transition-all uppercase tracking-widest"
            >
              ← BACK TO MAIN
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {loading ? (
            [...Array(10)].map((_, i) => <AssetSkeleton key={i} />)
          // --- 🛡️ FIX 3: Safe Mapping Guard ---
          ) : (Array.isArray(filteredAssets) && filteredAssets.length > 0) ? (
            filteredAssets.map(asset => (
              <AssetCard 
                key={asset._id} 
                asset={asset} 
                onOpen={handleAction}
                onAction={handleAction} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No resources found</p>
            </div>
          )}
        </div>

        {selectedFile && (
          <FilePreview 
            fileUrl={selectedFile.fileUrl}
            title={selectedFile.title}
            isOpen={isPreviewOpen}
            onClose={() => {
              setIsPreviewOpen(false);
              setSelectedFile(null);
            }}
          />
        )}
      </div>
    </section>
  );
};

export default StudentLibrary;
