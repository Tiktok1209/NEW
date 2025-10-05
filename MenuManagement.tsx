import React, { useState } from 'react';
import { MenuItem } from '../../types';
import { Plus, CreditCard as Edit3, Trash2, Save, X } from 'lucide-react';

interface MenuManagementProps {
  menuItems: MenuItem[];
  onUpdateMenuItem: (itemId: string, updates: Partial<MenuItem>) => void;
  onAddMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (itemId: string) => void;
}

const MenuManagement: React.FC<MenuManagementProps> = ({
  menuItems,
  onUpdateMenuItem,
  onAddMenuItem,
  onDeleteMenuItem
}) => {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    available: true,
    customizations: [],
    prepTime: 15
  });

  const handleAddItem = () => {
    if (newItem.name && newItem.price && newItem.category) {
      onAddMenuItem({
        id: `item-${Date.now()}`,
        name: newItem.name,
        description: newItem.description || '',
        price: newItem.price,
        category: newItem.category,
        image: newItem.image || 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400',
        available: newItem.available || true,
        customizations: newItem.customizations || [],
        prepTime: newItem.prepTime || 15
      } as MenuItem);
      
      setNewItem({
        name: '',
        description: '',
        price: 0,
        category: '',
        image: '',
        available: true,
        customizations: [],
        prepTime: 15
      });
      setShowAddForm(false);
    }
  };

  const handleUpdateItem = (itemId: string, field: keyof MenuItem, value: any) => {
    onUpdateMenuItem(itemId, { [field]: value });
  };

  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Menu Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Menu Item</span>
        </button>
      </div>

      {/* Add Item Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Add New Menu Item</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Enter item name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (R)</label>
              <input
                type="number"
                step="0.01"
                value={newItem.price}
                onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="0.00"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                rows={3}
                placeholder="Enter item description"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
                <option value="new">+ Add New Category</option>
              </select>
              {newItem.category === 'new' && (
                <input
                  type="text"
                  placeholder="Enter new category name"
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prep Time (minutes)</label>
              <input
                type="number"
                value={newItem.prepTime}
                onChange={(e) => setNewItem({...newItem, prepTime: parseInt(e.target.value) || 15})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                type="url"
                value={newItem.image}
                onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-4 mt-6">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAddItem}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add Item
            </button>
          </div>
        </div>
      )}

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="relative h-48">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                  className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => onDeleteMenuItem(item.id)}
                  className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {editingItem === item.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg font-bold text-lg"
                  />
                  
                  <textarea
                    value={item.description}
                    onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    rows={3}
                  />
                  
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => handleUpdateItem(item.id, 'price', parseFloat(e.target.value))}
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                    
                    <select
                      value={item.category}
                      onChange={(e) => handleUpdateItem(item.id, 'category', e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={item.available}
                        onChange={(e) => handleUpdateItem(item.id, 'available', e.target.checked)}
                        className="text-purple-600"
                      />
                      <span className="text-sm">Available</span>
                    </label>
                    
                    <input
                      type="number"
                      value={item.prepTime}
                      onChange={(e) => handleUpdateItem(item.id, 'prepTime', parseInt(e.target.value))}
                      className="w-20 px-2 py-1 border rounded text-sm"
                      placeholder="Prep time"
                    />
                    <span className="text-sm text-gray-500">min</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingItem(null)}
                      className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => setEditingItem(null)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                    <span className="text-lg font-bold text-purple-600">
                      R{item.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-500">{item.prepTime}min</span>
                    </div>
                    
                    <span className={`text-sm font-medium ${
                      item.available ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuManagement;