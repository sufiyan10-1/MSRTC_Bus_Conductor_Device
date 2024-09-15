'use client'

import React, { useEffect, useState } from 'react';
import './main.css';  // Add your CSS in a separate file
 
import axios from 'axios';
import Image from 'next/image';
import { QRCodeCanvas } from 'qrcode.react';
import { MoveLeft, MoveRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { usePathname } from 'next/navigation';
 

const BusPass = () => {
  const [identityData, setIdentityData] = useState([]);
  const [isIdentityAvailable, setIsIdentityAvailable] = useState('');
  const [qrValue, setQrValue] = useState(0);
  console.log(identityData)
  const pathname = usePathname();  
  const [firstPartOfUrl, setFirstPartOfUrl] = useState('');
  const [secondPartOfUrl, setSecondPartOfUrl] = useState('')
 
useEffect(() => {
  const id = pathname.split('/').pop();  
  if (id) {
    const [first, second] =  id.split('-'); 
    setFirstPartOfUrl(first);
    setSecondPartOfUrl(second);
  }
 
}, []);
 

 //getting identity
   useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.post('/api/view-identity', { IdNumber:firstPartOfUrl });
       if(!response){
         console.log("identity not found") 
        }
       else{
       setIdentityData(response.data.data)
       setIsIdentityAvailable(response.data.data.status)
       console.log(response.data.data)
       } 
    }catch(error){
      console.log(error);
      setIsIdentityAvailable("Identity Not Found")
    }   
    }
    setQrValue(identityData.status)
    fetchData();
    
    }, [firstPartOfUrl]); 
 

  //date making and 3d fliping of pass 
  const GoingdateMaker = () => {
    let datesContainer = document.querySelectorAll('#on-going-dates');
    datesContainer.forEach(dates => {
      let heightForDate = dates.getBoundingClientRect().height / 12;
      dates.innerHTML = ''; // Clear previous dates to avoid duplication
      for (let i = 1; i <= 31; i++) {
        let elm = document.createElement('span');
        elm.innerHTML = `${i}`;
        elm.classList.add('date');
        elm.style.height = `${heightForDate}px`;
        elm.style.width = `${heightForDate}px`;
  
        
        if (identityData.monthlyPass && identityData.monthlyPass[secondPartOfUrl] && identityData.monthlyPass[secondPartOfUrl].selectionGoing) {
          identityData.monthlyPass[secondPartOfUrl].selectionGoing.forEach((element, index) => {
            if(i===element){
              elm.classList.add('date-fill');
            }
          });
         
        }
  
        if (!(i > 31)) {
          dates.appendChild(elm);
        }
      }
    });
  };
  GoingdateMaker();

  const comingdateMaker = () => {
    let datesContainer = document.querySelectorAll('#on-coming-dates');
    datesContainer.forEach(dates => {
      let heightForDate = dates.getBoundingClientRect().height / 12;
      dates.innerHTML = ''; // Clear previous dates to avoid duplication
      for (let i = 1; i <= 31; i++) {
        let elm = document.createElement('span');
        elm.innerHTML = `${i}`;
        elm.classList.add('date');
        elm.style.height = `${heightForDate}px`;
        elm.style.width = `${heightForDate}px`;
  
        
        if (identityData.monthlyPass && identityData.monthlyPass[secondPartOfUrl] && identityData.monthlyPass[secondPartOfUrl].selectionComing) {
          identityData.monthlyPass[secondPartOfUrl].selectionComing.forEach((element, index) => {
            if(i===element){
              elm.classList.add('date-fill');
            }
          });
         
        }
  
        if (!(i > 31)) {
          dates.appendChild(elm);
        }
      }
    });
  };
  comingdateMaker()
  
   useEffect(() => {
  

    const backIcon = document.querySelector('#back-icon');
    const goIcon = document.querySelector('#go-icon');
    
    const handleBackIconClick = () => {
      document.querySelector('.pass-container').style.transform = 'rotateY(0deg)';
    };
    
    const handleGoIconClick = () => {
      document.querySelector('.pass-container').style.transform = 'rotateY(180deg)';
    };

    backIcon.addEventListener('click', handleBackIconClick);
    goIcon.addEventListener('click', handleGoIconClick);

    // Clean up event listeners when the component unmounts
    return () => {
      backIcon.removeEventListener('click', handleBackIconClick);
      goIcon.removeEventListener('click', handleGoIconClick);
    };
   }, []);

 //validation of traveling

 const handleSelectGoing = async ()=>{
  try {
     const response = await axios.post('/api/select-for-going',{IdNumber:firstPartOfUrl, passNumber:secondPartOfUrl})
     if(!response.data){
      toast({
        title: 'Error Occurred',
        description: response?.data?.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });   
     }
     else{
      toast({
        title: 'Date Update Successfully',
        description: response?.data?.message,
        variant:'outline'
      });
     }
  
  } catch (error) {
    toast({
      title: 'Faild! ',
      description: error?.response?.data?.message || 'Something went wrong. Please try again.',
      variant: 'destructive',
    });   
  }
}

const handleSelectComming = async()=>{
  try {
    const response = await axios.post('/api/select-for-coming',{IdNumber:firstPartOfUrl, passNumber:secondPartOfUrl})
    if(!response.data){
     toast({
       title: 'Failed! ',
       description: response?.data?.message || 'Something went wrong. Please try again.',
       variant: 'destructive',
     });   
    }
    else{
     toast({
       title: 'Date Update Successfully',
       description: response?.data?.message,
       variant:'outline'
     });
    }
 
 } catch (error) {
   toast({
     title: 'unexpected Error Occurred',
     description: error?.response?.data?.message || 'Something went wrong. Please try again.',
     variant: 'destructive',
   });   
 }
}
  

  return (
    <div className="main flex flex-col gap-6">
      <div className="pass-container">
        {/* Front Card */}
        <div className="front-card">
          <span id="go-icon">
            <MoveRight size={32} />
          </span>
          <div className="details-card">
            <div className="profile">
              <span className="student-name-container">
                <span className="student-name">{identityData.studentName}</span>
                <span className="student-class">{identityData.studClass}</span>
              </span>
            </div>

            <div className="locations">
              <div className="from-to-container">
                <div className="from">
                  <span>From</span>
                  <span className="from-name">{identityData.distanceFrom}</span>
                  <span className="from-address">Ardhapur, 431704</span>
                </div>

                <div className="location-logo">
                  <i className="ri-bus-fill"></i>
                </div>

                <div className="to">
                  <span>To</span>
                  <span className="to-name">{identityData.distanceTo}</span>
                  <span className="to-address">Nanded, 431605</span>
                </div>
              </div>

              <div className="start-end-dates">
                <div className="start-date">{identityData && Array.isArray(identityData.monthlyPass) && identityData.monthlyPass.length > secondPartOfUrl ?identityData.monthlyPass[secondPartOfUrl]?.startDate:'No start date available'}</div>
                <span>To</span>
                <div className="end-date">{identityData && Array.isArray(identityData.monthlyPass) && identityData.monthlyPass.length > secondPartOfUrl ?identityData.monthlyPass[secondPartOfUrl]?.endDate:'No end date available'}</div>
              </div>
            </div>

            <div className="basic-details">
              <span className="age-c">
                <span>Age:</span>
                <span id="age">20</span>
              </span>
              <span className="pass-id-c">
                <span>Pass Id:</span>
                <span id="padd-id">{identityData.IdNumber}</span>
              </span>
              <span className="fees-c">
                <span>Pass Fees:</span>
                <span id="fees">{identityData && Array.isArray(identityData.monthlyPass) && identityData.monthlyPass.length > secondPartOfUrl ?identityData.monthlyPass[secondPartOfUrl]?.passFees:'No start date available'}</span>
              </span>
              <span className="institute-name">
                <span>Institute Name:</span>
                <span id="institute-name">{identityData.nameOfCollegeOrSchool}</span>
              </span>
              <span className="institute-address">
                <span>Institute Address:</span>
                <span id="institute-address">{identityData.addressOfCollegeOrSchool}</span>
              </span>
            </div>

            <div className="qr h-12 w-12">
          
            <QRCodeCanvas
          value={String(identityData.IdNumber)}
          size={80} // Set the size of the QR code
          level={"H"} // Error correction level
          
        />
     
            </div>

            <div className="sign-container">
              <div>
                <span id="controller-sign">
                <img src="/controller-signature.png" />
                </span>
                <span>Controller Sign</span>
              </div>
              <div>
                <span id="student-sign">
                <img src={identityData.studentSign} />
                </span>
                <span>Student Sign</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back Card */}
        <div className="back-card">
          <div className="upper"></div>
          <span id="back-icon">
            <MoveLeft size={32} />
          </span>

          <div className="back-main">
            <div className="on-going">
              <span>On Going</span>
              <div className="dates" id="on-going-dates"></div>
            </div>
            <div className="on-coming">
              <span>On Coming</span>
              <div className="dates" id="on-coming-dates"></div>
            </div>
          </div>
        </div>
      </div>
      {/* buttons for checking */}
      <section>
        <div className='flex flex-col gap-6'>
          <button 
          className='bg-green-500 p-4 rounded-md text-white font-bold'
          onClick={(e)=>{e.preventDefault(); handleSelectGoing()}}>Select For Going</button>
          <button 
          className='bg-red-500 p-4 rounded-md text-white font-bold'
          onClick={(e)=>{e.preventDefault(); handleSelectComming()}}>Select For Comming</button>
        </div>
      </section>
    </div>
  );
};

export default BusPass;
