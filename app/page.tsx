import FileUpload from './components/FileUpload';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Bird Sound Predictor
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Upload an OGG audio file to identify the bird species
          </p>
        </div>
        
        <FileUpload />
      </main>
    </div>
  );
}
