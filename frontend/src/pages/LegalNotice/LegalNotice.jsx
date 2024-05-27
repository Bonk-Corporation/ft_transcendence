import React from 'react';
import { Card } from '../../components/utils/Card';

export function LegalNotice() {
  return (
    <Card className='p-6 max-w-[1200px]'>
        <h1 className="font-semibold text-2xl">
            MENTIONS LÉGALES
        </h1>
        <p className="px-4">
            Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance en l'économie numérique, il est précisé aux utilisateurs du site Ponk l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi.
        </p>
        <h1 className="font-semibold text-lg">
            Edition du site 
        </h1>
        <p className="px-4">
        Le présent site, accessible à l’URL www.ft-transcendence.fr (le « Site »), est édité par :
            <p className="px-4">
                - Julian Cario, résidant 3 rue des Stegosaures, 76600 Le Havre, de nationalité Française (France), né(e) le 31/12/2005, 
            </p>
            <p className="px-4">
                - Chay Ane Godard, résidant 2 rue des Abricots, 76600 Le Havre, de nationalité Française (France), né(e) le 20/01/2004, 
            </p>
            <p className="px-4">
                - Nils Laeremans, résidant 7 quai Arborescent, 76600 Le Havre, de nationalité Française (France), né(e) le 15/07/2004, 
            </p>
            <p className="px-4">
                - Gwechen Prigent, résidant 77 boulevard ChatGPT, 76600 Le Havre, de nationalité Française (France), né(e) le 01/02/2003, 
            </p>
            <p className="px-4">
                - Antoine Legay, résidant 14 rue Feur, 76600 Le Havre, de nationalité Française (France), né(e) le 11/09/2005,
            </p>
            <p className="px-4">
                - Victor Cornille, résidant 302 bis rue Sadoïava, 76600 Le Havre, de nationalité Française (France), né(e) le 21/05/2001
            </p>
        </p>
        <h1 className="font-semibold text-lg">
            Hébergement
        </h1>
        <p className="px-4">
            Le Site est hébergé par la société Hostinger International LTD, situé , (contact téléphonique ou email : https://www.hostinger.fr/contact).
        </p>
        <h1 className="font-semibold text-lg">
            Directeur de publication 
        </h1>
        <p className="px-4">
            Le Directeur de la publication du Site est DinoMalin.
        </p>   
        <h1 className="font-semibold text-lg">
            Nous contacter
        </h1>
        <div className="px-4">
            <p>
                jcario@student.42lehavre.fr
            </p>
        </div>
    </Card>
  );
}
