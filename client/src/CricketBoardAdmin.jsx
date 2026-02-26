import React, { useState } from 'react';

export default function CricketBoardAdmin() {
    const [boards, setBoards] = useState([]);
    const [formData, setFormData] = useState({ name: '', location: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddBoard = () => {
        if (formData.name && formData.location) {
            setBoards([...boards, { id: Date.now(), ...formData }]);
            setFormData({ name: '', location: '' });
        }
    };

    const handleDeleteBoard = (id) => {
        setBoards(boards.filter(board => board.id !== id));
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Cricket Board Admin</h1>
            
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    name="name"
                    placeholder="Board Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={{ marginRight: '10px', padding: '8px' }}
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleInputChange}
                    style={{ marginRight: '10px', padding: '8px' }}
                />
                <button onClick={handleAddBoard} style={{ padding: '8px 16px' }}>Add Board</button>
            </div>

            <div>
                {boards.map(board => (
                    <div key={board.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                        <p><strong>{board.name}</strong> - {board.location}</p>
                        <button onClick={() => handleDeleteBoard(board.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}