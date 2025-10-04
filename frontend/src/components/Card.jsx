// frontend/src/components/Card.jsx
import React from 'react';

export default function Card({ title, children }) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 m-4 border-l-8 border-green-500 hover:shadow-2xl transition-shadow">
      <h2 className="text-2xl font-bold text-green-700 mb-4">{title}</h2>
      {children}
    </div>
  );
}
