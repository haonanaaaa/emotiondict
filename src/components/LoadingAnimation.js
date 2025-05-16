import React from 'react';
import './LoadingAnimation.css';

const LoadingAnimation = ({ isVisible }) => {
  return (
    <div className={`loading-container ${isVisible ? 'visible' : ''}`}>
      <div className="rain-animation">
        {/* 硬编码9个雨滴以确保它们正确渲染 */}
        <div className="rain">
          <div className="drop"></div>
          <div className="waves">
            <div></div>
            <div></div>
          </div>
          
          <div className="particles">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        
        <div className="rain">
          <div className="drop"></div>
          <div className="waves">
            <div></div>
            <div></div>
          </div>
          
          <div className="particles">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        
        <div className="rain">
          <div className="drop"></div>
          <div className="waves">
            <div></div>
            <div></div>
          </div>
          
          <div className="particles">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        
        <div className="rain">
          <div className="drop"></div>
          <div className="waves">
            <div></div>
            <div></div>
          </div>
          
          <div className="particles">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        
        <div className="rain">
          <div className="drop"></div>
          <div className="waves">
            <div></div>
            <div></div>
          </div>
          
          <div className="particles">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        
        <div className="rain">
          <div className="drop"></div>
          <div className="waves">
            <div></div>
            <div></div>
          </div>
          
          <div className="particles">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        
        <div className="rain">
          <div className="drop"></div>
          <div className="waves">
            <div></div>
            <div></div>
          </div>
          
          <div className="particles">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        
        <div className="rain">
          <div className="drop"></div>
          <div className="waves">
            <div></div>
            <div></div>
          </div>
          
          <div className="particles">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        
        <div className="rain">
          <div className="drop"></div>
          <div className="waves">
            <div></div>
            <div></div>
          </div>
          
          <div className="particles">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation; 