import React from 'react';

export default function Content() {
  return (
    <div className="h-full bg-neutral-50 flex flex-col justify-between px-8 py-6">
      <div className="flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <div className="flex items-center mb-6 lg:mb-0">
                <img src="/icon.png" alt="Digital Toolkit" className="w-6 h-6 mr-3" />
                <h2 className="text-xl font-normal">Digital Toolkit for Open Environmental Research</h2>
              </div>
            </div>
            
            <div className="space-y-2 lg:justify-self-end">
              <div><a href="#" className="text-base hover:underline">Instagram</a></div>
              <div><a href="#" className="text-base hover:underline">LinkedIn</a></div>
              <div><a href="#" className="text-base hover:underline">GitHub</a></div>
              <div><a href="#" className="text-base hover:underline">Medium</a></div>
              <div><a href="#" className="text-base hover:underline">Substack</a></div>
              <div><a href="#" className="text-base hover:underline">Email</a></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto">
        <div className="text-left text-sm text-gray-600 mt-6">
          <p>Copyright 2025 © Open Environmental Data Project</p>
        </div>
      </div>
    </div>
  );
}