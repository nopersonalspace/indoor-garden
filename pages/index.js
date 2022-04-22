import Head from 'next/head'
//import Image from 'next/image'

import Layout from './../components/layout'
import PlantItem from './../components/plantItem'
import BasicButton from './../components/atoms/basicButton'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'

const arrowIcon = <FontAwesomeIcon id="arrow-right" icon={faAngleRight} className="rotate-90" />


export default function Home() {

  return (
    <Layout>
      <div>
        <Head>
          <title>Create First App</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />

          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#5C8B57" />
          <link rel="apple-touch-icon" href="/images/app_icons/icon.png" />
          <meta name="apple-mobile-web-app-status-bar" content="#5C8B57" />
        </Head>

        <main className="min-h-screen">
          <section className=' mx-6'>
            <PlantItem icon="🌸" name="Doris" popularName="Cherry Blossom" timeTillNextWater="2" wateringStreak="24" level="1"/>
            <PlantItem icon="🌷" name="Saturn" popularName="Tulip" timeTillNextWater="1" wateringStreak="142" level="3"/>
            <PlantItem icon="🌻" name="Herschel" popularName="Sunflower" timeTillNextWater="85" wateringStreak="5" level="2"/>
            <PlantItem icon="🌵" name="Kelper" popularName="Saguaro Cactus" timeTillNextWater="38" wateringStreak="174" level="5"/>
            <PlantItem icon="🥬" name="Bain" popularName="Romaine Lettuce" timeTillNextWater="4" wateringStreak="8" level="1"/>
            <BasicButton id="more-button" bgColor="bg-water-100" innerText="Less" otherText="More" icon={arrowIcon} />            
          </section>
        </main>

        
      </div>
    </Layout>
  )
}
