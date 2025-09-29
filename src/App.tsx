import React, { useEffect, useState } from 'react';
import Card from './components/Card';
import wingIconSvg from './angel-wing-icon.svg'; // Import as a path to the SVG

interface AppConfig {
  firstName: string;
  lastName: string;
  iconPath: string;
  description: string;
  years?: string;
  militaryRank?: string;
  unit?: string;
  dateOfDeath?: string;
  circumstances?: string;
  awards?: string;
  victimType?: string;
}


function App() {
  const [appConfig, setAppConfig] = useState<AppConfig[]>([]);

  useEffect(() => {
    fetch("/museum-of-memory/config.json")
      .then((response) => response.json())
      .then((data) => { setAppConfig(data) })
      .catch((error) => console.error("Error loading config:", error));
  }, []);

  return (
    <div className='min-h-screen bg-gray-100 relative'>
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-black to-transparent opacity-50 z-10" data-id="2"></div>
      <div className='relative z-20 pt-24 pb-12 px-4 sm:px-6 lg:px-8'>
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-12" data-id="5">
            <h1 className="text-4xl font-bold text-gray-900 mb-4" data-id="6">Небесні Янголи ВТЕІ ДТЕУ
            </h1>
            <p className="text-xl text-gray-600" data-id="7">В памʼять про загиблих у війні Росії проти України</p>
            <div className="flex justify-center mt-6">
              <img
                src={wingIconSvg}
                alt="Wing Icon"
                className="h-20 w-40 md:h-20 md:w-40 pointer-events-none select-none"
              />
            </div>
          </header>


          <div className="grid  grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
            {appConfig.map((person) => {
              const fullName = `${person.firstName} ${person.lastName}`;
              return (
                <Card
                  key={fullName}
                  title={fullName}
                  imgSrc={"/museum-of-memory/" + person.iconPath}
                  description={person.description}
                  years={person.years}
                  militaryRank={person.militaryRank}
                  unit={person.unit}
                  dateOfDeath={person.dateOfDeath}
                  circumstances={person.circumstances}
                  awards={person.awards}
                  victimType={person.victimType}
                />
              )
            })}
          </div>
        </div>
      </div></div>
  );
}

export default App;
