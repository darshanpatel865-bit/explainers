import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Explainer data - add new explainers here
const explainers = [
  {
    id: 'compound-interest',
    path: '/compound-interest',
    title: 'The Mathematics of Patience',
    subtitle: 'Compound Interest & Exponential Growth',
    description: 'Why Einstein (allegedly) called compound interest "the eighth wonder of the world" — and why understanding it might be the most valuable hour you spend this year.',
    tags: ['Finance', 'Mathematics', 'Investing'],
    status: 'published',
    date: '2026-02',
    readTime: '15 min',
    highlights: [
      'Linear vs exponential growth visualization',
      'The penny doubling game',
      'Rule of 72 calculator',
      'Why starting early beats investing more',
    ]
  },
  {
    id: 'diffusion-models',
    path: '/diffusion-models',
    title: 'Sculpting from Noise',
    subtitle: 'How Diffusion Models Generate Images',
    description: 'From pure static to photorealistic images — how AI learned to reverse entropy and create art from chaos.',
    tags: ['AI/ML', 'Deep Learning', 'Generative AI'],
    status: 'coming-soon',
    date: null,
    readTime: '20 min',
    highlights: [
      'Watch noise become image step-by-step',
      'The forward and reverse process',
      'Why diffusion beats GANs',
      'Interactive denoising visualization',
    ]
  },
  {
    id: 'bayes-theorem',
    path: '/bayes-theorem',
    title: 'Updating Your Beliefs',
    subtitle: 'Bayes\' Theorem & Probabilistic Thinking',
    description: 'Why a 99% accurate medical test might only mean 50% chance you\'re sick — and how to think clearly about uncertainty.',
    tags: ['Probability', 'Statistics', 'Decision Making'],
    status: 'coming-soon',
    date: null,
    readTime: '18 min',
    highlights: [
      'Interactive probability calculator',
      'Medical test false positive paradox',
      'Prior vs posterior visualization',
      'Real-world Bayesian reasoning',
    ]
  },
  {
    id: 'gradient-descent',
    path: '/gradient-descent',
    title: 'Rolling Downhill',
    subtitle: 'How Neural Networks Learn',
    description: 'The surprisingly simple algorithm behind all of modern AI — finding the bottom of a valley you can\'t see.',
    tags: ['AI/ML', 'Mathematics', 'Optimization'],
    status: 'coming-soon',
    date: null,
    readTime: '15 min',
    highlights: [
      '3D loss landscape explorer',
      'Learning rate effects',
      'Local minima and saddle points',
      'Momentum visualization',
    ]
  },
  {
    id: 'fourier-transform',
    path: '/fourier-transform',
    title: 'The Hidden Frequencies',
    subtitle: 'Fourier Transform & Signal Decomposition',
    description: 'Any signal is just a sum of sine waves — the mathematical trick that powers everything from MP3s to MRIs.',
    tags: ['Mathematics', 'Signal Processing', 'Physics'],
    status: 'coming-soon',
    date: null,
    readTime: '20 min',
    highlights: [
      'Draw waves, see frequencies',
      'Audio spectrum analyzer',
      'Image compression demo',
      'From time domain to frequency domain',
    ]
  },
  {
    id: 'central-limit-theorem',
    path: '/central-limit-theorem',
    title: 'Why Everything is Normal',
    subtitle: 'The Central Limit Theorem',
    description: 'Roll enough dice and the sum is always a bell curve — the deepest theorem in statistics, explained.',
    tags: ['Statistics', 'Probability', 'Mathematics'],
    status: 'coming-soon',
    date: null,
    readTime: '12 min',
    highlights: [
      'Interactive dice roller',
      'Watch distributions converge',
      'Sample size effects',
      'Real-world applications',
    ]
  },
];

// Status badge component
const StatusBadge = ({ status }) => {
  if (status === 'published') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
        Published
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
      Coming Soon
    </span>
  );
};

// Tag component
const Tag = ({ children }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
    {children}
  </span>
);

// Explainer card component
const ExplainerCard = ({ explainer }) => {
  const isPublished = explainer.status === 'published';
  
  const CardContent = () => (
    <>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className={`text-xl font-bold ${isPublished ? 'text-gray-900' : 'text-gray-500'}`}>
            {explainer.title}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{explainer.subtitle}</p>
        </div>
        <StatusBadge status={explainer.status} />
      </div>
      
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {explainer.description}
      </p>
      
      <div className="flex flex-wrap gap-1.5 mb-4">
        {explainer.tags.map(tag => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
      
      {isPublished && (
        <div className="border-t border-gray-100 pt-4 mt-4">
          <div className="text-xs font-medium text-gray-500 mb-2">HIGHLIGHTS</div>
          <ul className="text-sm text-gray-600 space-y-1">
            {explainer.highlights.slice(0, 3).map((h, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-blue-500">→</span> {h}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {isPublished && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-400">{explainer.readTime} read</span>
          <span className="text-blue-600 font-medium">
            Explore →
          </span>
        </div>
      )}
    </>
  );
  
  if (isPublished) {
    return (
      <Link 
        to={explainer.path}
        className="block bg-white rounded-xl border border-gray-200 p-6 transition-all duration-200 hover:border-blue-300 hover:shadow-lg"
      >
        <CardContent />
      </Link>
    );
  }
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 opacity-75">
      <CardContent />
    </div>
  );
};

// Filter tabs
const FilterTabs = ({ activeFilter, setActiveFilter, counts }) => {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'published', label: 'Published' },
    { id: 'coming-soon', label: 'Coming Soon' },
  ];
  
  return (
    <div className="flex gap-2 mb-8">
      {filters.map(f => (
        <button
          key={f.id}
          onClick={() => setActiveFilter(f.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === f.id
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {f.label} ({counts[f.id]})
        </button>
      ))}
    </div>
  );
};

// Main landing page component
export default function LandingPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const counts = {
    all: explainers.length,
    published: explainers.filter(e => e.status === 'published').length,
    'coming-soon': explainers.filter(e => e.status === 'coming-soon').length,
  };
  
  const filteredExplainers = explainers.filter(e => {
    if (activeFilter === 'all') return true;
    return e.status === activeFilter;
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Interactive Explainers
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
            Deep dives into concepts that matter — with interactive visualizations, 
            concrete examples, and quizzes to build real understanding.
          </p>
          <p className="text-gray-500 mt-4 text-sm">
            Inspired by{' '}
            <a href="https://paraschopra.github.io/explainers/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              Paras Chopra
            </a>{' '}and{' '}
            <a href="https://ciechanow.ski/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              Bartosz Ciechanowski
            </a>.
            Built with Claude.
          </p>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <FilterTabs 
          activeFilter={activeFilter} 
          setActiveFilter={setActiveFilter}
          counts={counts}
        />
        
        <div className="grid gap-6 md:grid-cols-2">
          {filteredExplainers.map(explainer => (
            <ExplainerCard 
              key={explainer.id} 
              explainer={explainer}
            />
          ))}
        </div>
        
        {/* Philosophy section */}
        <div className="mt-16 bg-white rounded-xl border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Philosophy</h2>
          <div className="prose text-gray-600 max-w-none">
            <p>
              These explainers are built on a few principles:
            </p>
            <ul className="mt-4 space-y-3 list-none pl-0">
              <li className="flex gap-3">
                <span className="text-blue-500 font-bold">01</span>
                <span><strong>Interactivity over passivity.</strong> You don't understand something until you've played with it. Every explainer has sliders, visualizations, and controls.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-500 font-bold">02</span>
                <span><strong>Intuition before formalism.</strong> Start with concrete examples and visual intuition. The math comes after you already "get it."</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-500 font-bold">03</span>
                <span><strong>Test your understanding.</strong> Quizzes and exercises aren't optional — they're where real learning happens.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-500 font-bold">04</span>
                <span><strong>Progressive depth.</strong> Start simple, go deep. Every reader should find their level.</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Suggest topics */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Have a topic suggestion?</h3>
          <p className="text-gray-600 text-sm">
            I'm always looking for concepts that deserve a deep, interactive explanation. 
            The best topics are counterintuitive, visual, and have real-world applications.
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <div className="border-t bg-white mt-16">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center text-sm text-gray-500">
          <p>Built for learning. Inspired by curiosity.</p>
          <p className="mt-1">
            <span className="text-gray-400">•</span> {counts.published} published 
            <span className="text-gray-400 mx-2">•</span> {counts['coming-soon']} in progress 
            <span className="text-gray-400 mx-2">•</span> ∞ to explore
          </p>
        </div>
      </div>
    </div>
  );
}
