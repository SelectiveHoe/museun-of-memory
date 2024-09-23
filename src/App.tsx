import React, { useEffect, useState } from 'react';
import Card from './components/Card';

interface AppConfig {
  firstName: string;
  lastName: string;
  iconPath: string;
}


function App() {
  const [appConfig, setAppConfig] = useState<AppConfig[]>([]);

  useEffect(() => {
    fetch("/museum-of-memory/config.json")
      .then((response) => response.json())
      .then((data) => {setAppConfig(data)})
      .catch((error) => console.error("Error loading config:", error));
  }, []);
  
  return (
    <div className='min-h-screen bg-gray-100 relative'>
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-black to-transparent opacity-50 z-10" data-id="2"></div>
    <div className='relative z-20 pt-24 pb-12 px-4 sm:px-6 lg:px-8'>
    <div className="max-w-4xl mx-auto">
      <header className="text-center mb-12" data-id="5"><h1 className="text-4xl font-bold text-gray-900 mb-4" data-id="6">In Memory of Our Fallen Heroes</h1><p className="text-xl text-gray-600" data-id="7">Honoring those who made the ultimate sacrifice for our freedom and security.</p></header>
      <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {appConfig.map(({firstName,iconPath,lastName}) => {
          const fullName = `${firstName} ${lastName}`;
          return (
            <Card key={fullName} title={fullName} imgSrc={"/museum-of-memory/" + iconPath}/>
      )})}
      </div>
    </div>
    </div></div>
  );
}

export default App;
