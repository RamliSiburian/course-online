'use client'
import { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';

function HomePage() {
  const [tabCount, setTabCount] = useState(0);

  useEffect(() => {
    let currentTab = 0;

    const handleBeforeUnload = () => {
      currentTab++;
      if (currentTab > 1) {
        alert('Warning: You have multiple tabs open. Closing this tab might cause data loss.');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    setTabCount(prevTabCount => prevTabCount + 1);
  }, []);

  

  const data = {
    name : 'MTK',
    duration: 90,
    qusetions: [
      {no:1, question: '10 + 10 is ?'},
      {no:2, question: '15 - 10 is ?'}
    ],
    answers: [
      {soalNo: 1, answer: [{a:20, b:10,c:15,d:25 }]},
      {soalNo: 2, answer: [{a:0, b:5,c:15,d:25 }]}
    ]
  }

  const key = 'test'

  const storeData = () => {
    const encrypted = CryptoJS.AES.encrypt( JSON.stringify(data), key).toString();
  localStorage.setItem('exam', encrypted);

 
    
  }

  const getData = () => {
    const encrypted = localStorage.getItem('exam');
    const decrypted = CryptoJS.AES.decrypt(encrypted as any, key).toString(CryptoJS.enc.Utf8);
    const datas = JSON.parse(decrypted);

    console.log({ datas});
    
  }
  

  return (
    <>
    <div>test</div>
    <button onClick={storeData}>store</button>
    <br />

    <button onClick={getData}>get data</button>
    </>
  )
}

export default HomePage;