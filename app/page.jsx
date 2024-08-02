"use client"
import { useRouter } from 'next/navigation';
import Header from "./dashboard/_components/Header";
import React from 'react';

const HomePage = () => {

  const router=useRouter();
  const handleGetStarted = () => {
    router.push('/dashboard'); 
  };
  return (
    <>
    <Header/>
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      
      <main style={{ textAlign: 'center', padding: '50px 20px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>Your Personal AI Interview Coach</h1>
        <p style={{ fontSize: '24px', marginBottom: '40px' }}>Double your chances of landing that job offer with our AI-powered interview prep</p>
        <div>
        <button
            onClick={handleGetStarted}
            style={{
              textDecoration: 'none',
              padding: '10px 20px',
              backgroundColor: '#5f63f2',
              color: '#fff',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Get Started
          </button>
        </div>
      
        <section style={{ marginTop: '60px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>How it Works?</h2>
          <p style={{ fontSize: '18px', marginBottom: '40px' }}>Give mock interviews in just 3 simple steps</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <div style={{ width: '30%', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Step 1</div>
              <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>Choose Your Interview Style</h3>
              <p>Select from a variety of interview styles, including technical, behavioral, and case study formats, to simulate real interview conditions.</p>
            </div>
            <div style={{ width: '30%', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Step 2</div>
              <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>Practice with AI Feedback</h3>
              <p>Answer questions and get real-time feedback from our AI on your responses, helping you improve with every practice session.</p>
            </div>
            <div style={{ width: '30%', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Step 3</div>
              <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>Review & Improve</h3>
              <p>Review your performance, understand your strengths and weaknesses, and get tips to refine your answers and delivery.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
    </>
  );
}

export default HomePage;
