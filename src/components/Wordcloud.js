import React, { useEffect, useRef } from 'react';
import './Wordcloud.css';

const Wordcloud = ({ words, potency }) => {
  const cloudRef = useRef(null);

  useEffect(() => {
    if (!words || words.length === 0 || !cloudRef.current) return;

    // 清空之前的内容
    cloudRef.current.innerHTML = '';

    // 创建文档片段，减少DOM操作
    const fragment = document.createDocumentFragment();

    // 为每个单词创建元素
    words.forEach((word, index) => {
      // 生成1到3之间的随机字体大小
      const fontSize = (Math.random() * 3 + 1).toFixed(2);
      
      // 生成0.3到1之间的随机透明度
      const opacity = (Math.random() * 0.7 + 0.3).toFixed(2);

      // 创建word元素
      const wordElement = document.createElement('div');
      wordElement.classList.add('wordcloud-word');
      wordElement.textContent = word;
      wordElement.style.fontSize = `${fontSize}em`;
      wordElement.style.opacity = opacity;
      
      // 应用颜色类和potency属性
      wordElement.classList.add('color');
      wordElement.setAttribute('data-potency', potency);

      // 添加到文档片段
      fragment.appendChild(wordElement);
    });

    // 将文档片段一次性添加到DOM
    cloudRef.current.appendChild(fragment);
  }, [words, potency]);

  return (
    <div className="wordcloud-container" ref={cloudRef}></div>
  );
};

export default Wordcloud;
