import { FaCommentAlt } from "react-icons/fa"; 
import { Tooltip } from "antd";
import Link from "next/link";
import React from "react";
import { FaInfoCircle, FaUserInjured, FaUserMd } from "react-icons/fa";
import { GiHistogram, GiTestTubes } from "react-icons/gi";
import { MdMedicalServices } from "react-icons/md";


export default function Accueil(){
    return (
        <div>

            {/* MENU GENERALE  */}
        <div className="w-full h-[100px] bg-gray-700 shadow-lg z-10 p-4 overflow-auto flex items-center justify-between">
        {/* Titre à gauche */}
        <div className="flex space-x-1 text-white text-left">
        <div><img src="/Images/mainty_48.png" className="pl-3 pt-2 " /></div>
        <div><h2 className="text-[32px] pl-[6px] pt-2 font-bold text-white">
          Laboratoire
        </h2></div>
        </div>
        
        {/* Éléments à droite */}
        <div className="flex space-x-4">
          <div className=" text-white p-2 bg-gray-600 rounded">
          <Tooltip title="Hospitalisé / Externe" placement="bottom" arrow>
            <Link href="/page/patient/hospitalise">
             <div className="flex space-x-1">
           <div>  <button>
                <FaUserInjured className="text-[15px]" />
              </button></div>
             <div> <p className="text-[15px] font-semibold">Patients</p></div>
             </div>
            </Link>
          </Tooltip>
          </div>
          <div className=" text-white p-2 bg-gray-600 rounded">
          <Tooltip title="Testes / Échantillons" placement="bottom" arrow>
            <Link href="/page/patient/hospitalise">
             <div className="flex space-x-1">
           <div>  <button>
           <GiTestTubes className="text-[15px]" />
              </button></div>
             <div> <p className="text-[15px] font-semibold">Testes</p></div>
             </div>
            </Link>
          </Tooltip>
          </div>
          <div className=" text-white p-2 bg-gray-600 rounded">
          <Tooltip title="Matériels / Intrants" placement="bottom" arrow>
            <Link href="/page/patient/hospitalise">
             <div className="flex space-x-1">
           <div>  <button>
           <MdMedicalServices className="text-[15px]" />
              </button></div>
             <div> <p className="text-[15px] font-semibold">Matériels</p></div>
             </div>
            </Link>
          </Tooltip>
          </div>
          <div className=" text-white p-2 bg-gray-600 rounded">
          <Tooltip title="Personnels du laboratoire" placement="bottom" arrow>
          <Link href="/page/personnel">
             <div className="flex space-x-1">
           <div>  <button>
           <FaUserMd className="text-[15px]" />
              </button></div>
             <div> <p className="text-[15px] font-semibold">Personnels</p></div>
             </div>
            </Link>
          </Tooltip>
          </div>
          <div className=" text-white p-2 bg-gray-600 rounded">
          <Tooltip title="Tableau de bord / Rapport Analytique" placement="bottom" arrow>
            <Link href="/page/stat/patient">
             <div className="flex space-x-1">
           <div>  <button>
           <GiHistogram className="text-[15px]" />
              </button></div>
             <div> <p className="text-[15px] font-semibold">Statistiques</p></div>
             </div>
            </Link>
          </Tooltip>
          </div>

          <div className="text-white p-2 bg-gray-600 rounded">
      <Tooltip title="Commentaire et Suggestions" placement="bottom" arrow>
        <div className="flex space-x-1">
          <div>
            <a href="mailto:votre.anaiarandrianantenaina@gmail.com?subject=Commentaire et Suggestions">
              <FaCommentAlt className="text-[20px]" />
            </a>
          </div>
        </div>
      </Tooltip>
    </div>

          <div className=" text-white p-2 bg-gray-600 rounded">
          <Tooltip title="À propos" placement="bottom" arrow>
            <Link href="/page/stat/patient">
             <div className="flex space-x-1">
           <div>  <button>
           <FaInfoCircle className="text-[20px]" />
              </button></div>

             </div>
            </Link>
          </Tooltip>
          </div>
        </div>
      </div>      

        {/* GRAND TITRE  */}
      <div className="relative w-full h-[450px] shadow-sm z-10 p-4 overflow-auto flex items-center justify-center">
      {/* Image de fond floutée */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/Images/fond.png')",
          filter: "blur(3px)", // Ajoute un effet de flou
          zIndex: -1, // Place l'image derrière le contenu
        }}
      ></div>

      {/* Contenu par-dessus */}
      <div className="relative z-50 text-center">
        <h1 className="text-5xl font-bold text-gray-800">Système de Gestion du Laboratoire</h1>
        <h2 className="text-2xl text-gray-800 mt-4">Centre Hospitalier Universitaire Tambohobe Fianarantsoa</h2>
      </div>
    </div>

    {/* PARTIE 3 */}
    <div className="w-full h-[298px] bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 shadow-lg z-30 p-8 overflow-auto rounded-lg">
  <div className="flex justify-center items-start space-x-8">
    {/* Première section */}
    <div className="space-y-3 h-[253px] max-w-sm text-center bg-white p-6 rounded-lg shadow-2xl transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-gray-50">
      <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2">Gestion des Patients et du Personnel</h2>
      <p className="text-[14px] text-gray-600">
        Optimisez la gestion des patients et du personnel dans votre laboratoire. Centralisez les informations médicales et personnelles des patients, tout en assurant un suivi rigoureux des personnels, y compris la gestion des plannings, des formations, et des ressources humaines.
      </p>
    </div>

    {/* Deuxième section */}
    <div className="space-y-3 max-w-sm text-center bg-white p-6 rounded-lg shadow-2xl transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-gray-50">
      <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2">Gestion des Tests, Échantillons et Matériels</h2>
      <p className="text-[14px] text-gray-600">
        Gérez efficacement les tests de laboratoire, les échantillons, et les matériels. Organisez et suivez les tests, assurez la gestion des échantillons, et garantissez une gestion rigoureuse des équipements et des ressources, incluant les stocks et la maintenance.
      </p>
    </div>

    {/* Troisième section */}
    <div className="space-y-3 max-w-sm text-center bg-white p-6 rounded-lg shadow-2xl transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-gray-50">
      <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2">Tableaux de Bord et Rapports Analytiques</h2>
      <p className="text-[14px] text-gray-600">
        Visualisez les performances globales de votre laboratoire avec nos tableaux de bord personnalisés et générez des rapports analytiques détaillés. Analysez les tendances, suivez les indicateurs clés, et améliorez la prise de décision pour une gestion plus efficace.
      </p>
    </div>
  </div>
</div>


{/* PARTIE EN BAS   */}
   <div className="mt-1 h-[35px] bg-gray-700 text-center text-white flex items-center justify-center rounded">
    <p className="text-[14px]">Découvrez plus sur notre solution pour améliorer votre laboratoire.</p>
  </div>


      </div>
    )
} 