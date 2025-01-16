import React from 'react';
import PostManager from './PostManager';
import PostList from './PostList';

export default function Dashboard() {
  return (
    <div className="grid gap-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
          <PostManager />
        </div>
      </div>
      
      <div className="bg-white shadow sm:rounded-lg">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Posts Recentes</h2>
          <PostList />
        </div>
      </div>
    </div>
  );
}
