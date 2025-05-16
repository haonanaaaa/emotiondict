import React from 'react';
import './SortControl.css';

const SortControls = ({ sortBy, sortOrder, onSort }) => {
    // 排序选项描述
    const descriptions = {
        granularity: '情感粒度表示情绪的细致性与特定性。值越高越清晰，越低越模糊。在可视化中，体现为字体的模糊程度。',
        potency: '效价表示情绪的积极或消极属性。值大于3为积极，小于3为消极。在可视化中，体现为词条的边框颜色。',
        intensity: '强度表示情绪的强烈程度。越高意味着情绪越强烈。在可视化中，体现为字体颜色的深浅。',
        complexity: '复杂度表示情绪的混合与复杂程度。越高越复杂。在可视化中，体现为字符的翻转效果。',
        createdAt: '创作时间表示词汇被添加到词典的时间。排序则可以查看最新或最早的词条。'
    };

    return (
        <div className="sort-control-container">
            <div className="sort-controls">
                <button 
                    className={`sort-button ${sortBy === 'createdAt' ? 'active' : ''}`}
                    onClick={() => onSort('createdAt')}
                >
                    创作时间 {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button 
                    className={`sort-button ${sortBy === 'granularity' ? 'active' : ''}`}
                    onClick={() => onSort('granularity')}
                >
                    粒度 {sortBy === 'granularity' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button 
                    className={`sort-button ${sortBy === 'potency' ? 'active' : ''}`}
                    onClick={() => onSort('potency')}
                >
                    效价 {sortBy === 'potency' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button 
                    className={`sort-button ${sortBy === 'intensity' ? 'active' : ''}`}
                    onClick={() => onSort('intensity')}
                >
                    强度 {sortBy === 'intensity' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button 
                    className={`sort-button ${sortBy === 'complexity' ? 'active' : ''}`}
                    onClick={() => onSort('complexity')}
                >
                    复杂度 {sortBy === 'complexity' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
            </div>
            
            {/* 显示当前激活选项的描述 */}
            {sortBy && (
                <div className="sort-description">
                    {descriptions[sortBy]}
                </div>
            )}
        </div>
    );
};

export default SortControls; 