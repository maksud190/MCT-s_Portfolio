import { useState } from "react";
import { toast } from "react-toastify";

export default function ImageConverter() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [convertedImage, setConvertedImage] = useState(null);
  const [outputFormat, setOutputFormat] = useState("jpeg");
  const [isConverting, setIsConverting] = useState(false);
  const [quality, setQuality] = useState(0.9);

  const supportedFormats = [
    { value: "jpeg", label: "JPEG", extension: ".jpg" },
    { value: "png", label: "PNG", extension: ".png" },
    { value: "webp", label: "WebP", extension: ".webp" },
    { value: "bmp", label: "BMP", extension: ".bmp" },
  ];

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file!");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size should be less than 10MB!");
      return;
    }

    setSelectedFile(file);
    setConvertedImage(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    toast.success("Image loaded successfully!");
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first!");
      return;
    }

    setIsConverting(true);

    try {
      const img = new Image();
      img.src = previewUrl;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        let mimeType = `image/${outputFormat}`;
        
        if (outputFormat === "jpeg" || outputFormat === "jpg") {
          mimeType = "image/jpeg";
        }

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              toast.error("Conversion failed!");
              setIsConverting(false);
              return;
            }

            const url = URL.createObjectURL(blob);
            setConvertedImage({
              url,
              blob,
              size: blob.size,
              format: outputFormat,
            });

            setIsConverting(false);
            toast.success(`Converted to ${outputFormat.toUpperCase()} successfully!`);
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => {
        toast.error("Failed to load image!");
        setIsConverting(false);
      };
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Conversion failed!");
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedImage) return;

    const link = document.createElement("a");
    link.href = convertedImage.url;
    
    const originalName = selectedFile.name.split(".")[0];
    const extension = supportedFormats.find(f => f.value === outputFormat)?.extension || ".jpg";
    link.download = `${originalName}_converted${extension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Image downloaded!");
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setConvertedImage(null);
    setOutputFormat("jpeg");
    setQuality(0.9);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-200/20 via-indigo-300/20 to-slate-50">
      {/* Hero Section */}
      <div className="py-8 md:py-12 lg:py-16 px-4 md:px-6 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 md:mb-4 text-stone-800">
          🖼️ Image Converter
        </h1>
        <p className="text-sm sm:text-base md:text-xl max-w-2xl mx-auto text-blue-800">
          Convert your images to different formats easily. Support for JPEG, PNG, WebP, and more!
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-12 md:pb-16">
        <div className="bg-white rounded-sm shadow-lg p-4 md:p-6 lg:p-8">
          
          {/* File Upload Section */}
          <div className="mb-6 md:mb-8">
            <label className="block mb-3 md:mb-4">
              <span className="text-base md:text-lg font-semibold text-gray-800 mb-2 block">
                📁 Select Image
              </span>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="block w-full text-xs sm:text-sm text-gray-500
                    file:mr-3 file:py-2 file:px-4 md:file:py-3 md:file:px-6
                    file:rounded-sm file:border-0
                    file:text-xs sm:file:text-sm file:font-semibold
                    file:bg-stone-800 file:text-white
                    hover:file:bg-stone-900
                    file:cursor-pointer cursor-pointer
                    border-2 border-dashed border-gray-300 rounded-sm p-3 md:p-4
                    hover:border-stone-800 transition-colors"
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Supported formats: JPG, PNG, WebP, BMP | Max size: 10MB
              </p>
            </label>
          </div>

          {/* Preview & Conversion Options */}
          {previewUrl && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-8">
              
              {/* Original Image Preview */}
              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">
                  📷 Original Image
                </h3>
                <div className="border-2 border-gray-300 rounded-lg p-3 md:p-4 bg-gray-50">
                  <img
                    src={previewUrl}
                    alt="Original"
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                  <div className="mt-3 md:mt-4 text-xs sm:text-sm text-gray-600 space-y-1">
                    <p className="break-all"><strong>File:</strong> {selectedFile.name}</p>
                    <p><strong>Size:</strong> {formatFileSize(selectedFile.size)}</p>
                    <p><strong>Type:</strong> {selectedFile.type}</p>
                  </div>
                </div>
              </div>

              {/* Conversion Options */}
              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">
                  ⚙️ Conversion Options
                </h3>
                
                {/* Output Format */}
                <div className="mb-4 md:mb-6">
                  <label className="block mb-2 text-xs sm:text-sm font-medium text-gray-700">
                    Output Format
                  </label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-300 text-stone-800 rounded-sm focus:border-stone-800 focus:outline-none transition-colors text-sm md:text-base"
                  >
                    {supportedFormats.map((format) => (
                      <option key={format.value} value={format.value}>
                        {format.label} ({format.extension})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quality Slider */}
                {(outputFormat === "jpeg" || outputFormat === "webp") && (
                  <div className="mb-4 md:mb-6">
                    <label className="block mb-2 text-xs sm:text-sm font-medium text-gray-700">
                      Quality: {Math.round(quality * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={quality}
                      onChange={(e) => setQuality(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-stone-800"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                )}

                {/* Convert Button */}
                <button
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="w-full bg-stone-800 text-white py-2 md:py-3 px-4 md:px-6 rounded-sm font-semibold hover:bg-stone-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  {isConverting ? (
                    <>
                      <div className="animate-spin rounded-sm h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
                      Converting...
                    </>
                  ) : (
                    <>
                      🔄 Convert Image
                    </>
                  )}
                </button>

                {/* Converted Image Preview */}
                {convertedImage && (
                  <div className="mt-4 md:mt-6 p-3 md:p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2 text-sm md:text-base">
                      ✅ Conversion Successful!
                    </h4>
                    <img
                      src={convertedImage.url}
                      alt="Converted"
                      className="w-full h-auto rounded-lg shadow-md mb-3"
                    />
                    <div className="text-xs sm:text-sm text-gray-700 mb-3 space-y-1">
                      <p><strong>Format:</strong> {convertedImage.format.toUpperCase()}</p>
                      <p><strong>Size:</strong> {formatFileSize(convertedImage.size)}</p>
                      <p className={`font-semibold ${
                        convertedImage.size < selectedFile.size ? "text-green-600" : "text-orange-600"
                      }`}>
                        {convertedImage.size < selectedFile.size ? "📉" : "📈"} {" "}
                        {((convertedImage.size / selectedFile.size) * 100).toFixed(1)}% of original
                      </p>
                    </div>
                    
                    {/* Download Button */}
                    <button
                      onClick={handleDownload}
                      className="w-full bg-green-600 text-white py-2 px-3 md:px-4 rounded-sm font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                      📥 Download Image
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reset Button */}
          {previewUrl && (
            <div className="text-center">
              <button
                onClick={handleReset}
                className="bg-gray-500 text-white py-2 px-4 md:px-6 rounded-sm font-semibold hover:bg-gray-600 transition-colors text-sm md:text-base"
              >
                🔄 Convert Another Image
              </button>
            </div>
          )}

          {/* Empty State */}
          {!previewUrl && (
            <div className="text-center py-12 md:py-16">
              <div className="text-6xl md:text-8xl mb-4 md:mb-6">🖼️</div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2 md:mb-3">
                No Image Selected
              </h3>
              <p className="text-sm md:text-base text-gray-600 max-w-md mx-auto px-4">
                Upload an image to get started. You can convert between JPEG, PNG, WebP, and BMP formats.
              </p>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12">
          <div className="bg-white p-4 md:p-6 rounded-sm shadow-md text-center">
            <div className="text-3xl md:text-4xl mb-2 md:mb-3">⚡</div>
            <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Fast Conversion</h3>
            <p className="text-xs md:text-sm text-gray-600">
              Convert images instantly in your browser
            </p>
          </div>
          
          <div className="bg-white p-4 md:p-6 rounded-sm shadow-md text-center">
            <div className="text-3xl md:text-4xl mb-2 md:mb-3">🔒</div>
            <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">100% Private</h3>
            <p className="text-xs md:text-sm text-gray-600">
              All processing happens locally, no upload to servers
            </p>
          </div>
          
          <div className="bg-white p-4 md:p-6 rounded-sm shadow-md text-center sm:col-span-2 md:col-span-1">
            <div className="text-3xl md:text-4xl mb-2 md:mb-3">🎨</div>
            <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Quality Control</h3>
            <p className="text-xs md:text-sm text-gray-600">
              Adjust compression quality for optimal results
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}