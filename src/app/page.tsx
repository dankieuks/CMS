"use client"
import { FC, useState } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';

const Dashboard: FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <p>This is the Dashboard content.</p>;
      case 'orders':
        return <p>This is the Orders content.</p>;
      case 'reports':
        return <p>This is the Reports content.</p>;
      case 'integrations':
        return <p>This is the Integrations content.</p>;
      default:
        return <p>Select an option from the sidebar.</p>;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white h-screen p-4">nh
        <h2 className="text-xl font-bold mb-8">Dashboard</h2>
        <nav>
          <ul>
            <li className="mb-4">
              <a
                href="#"
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center text-white hover:bg-blue-700 p-2 rounded ${activeTab === 'dashboard' ? 'bg-blue-700' : ''}`}
              >
                <DashboardIcon className="mr-2" />
                Dashboard
              </a>
            </li>
            <li className="mb-4">
              <a
                href="#"
                onClick={() => setActiveTab('orders')}
                className={`flex items-center text-white hover:bg-blue-700 p-2 rounded ${activeTab === 'orders' ? 'bg-blue-700' : ''}`}
              >
                <ShoppingCartIcon className="mr-2" />
                Orders
              </a>
            </li>
            <li className="mb-4">
              <a
                href="#"
                onClick={() => setActiveTab('reports')}
                className={`flex items-center text-white hover:bg-blue-700 p-2 rounded ${activeTab === 'reports' ? 'bg-blue-700' : ''}`}
              >
                <BarChartIcon className="mr-2" />
                Reports
              </a>
            </li>
            <li className="mb-4">
              <a
                href="#"
                onClick={() => setActiveTab('integrations')}
                className={`flex items-center text-white hover:bg-blue-700 p-2 rounded ${activeTab === 'integrations' ? 'bg-blue-700' : ''}`}
              >
                <LayersIcon className="mr-2" />
                Integrations
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Content</h2>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
