import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';

// Utility function for formatting currency
const formatCurrency = (value) => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
};

// Section Component
const Section = ({ number, title, children }) => (
  <div className="mb-16">
    <div className="flex items-baseline gap-3 mb-6">
      <span className="text-sm font-mono text-gray-400">{number}.</span>
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    </div>
    {children}
  </div>
);

// Callout Box
const Callout = ({ emoji, title, children }) => (
  <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
    <div className="font-semibold text-amber-800 mb-1">{emoji} {title}</div>
    <div className="text-amber-900 text-sm">{children}</div>
  </div>
);

// Quiz Component
const Quiz = ({ question, answer, explanation }) => {
  const [revealed, setRevealed] = useState(false);
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 my-6">
      <div className="font-semibold text-blue-900 mb-3">🧠 {question}</div>
      {!revealed ? (
        <button 
          onClick={() => setRevealed(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Reveal Answer
        </button>
      ) : (
        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <div className="font-bold text-blue-800 mb-2">{answer}</div>
          <div className="text-gray-700 text-sm">{explanation}</div>
        </div>
      )}
    </div>
  );
};

// Linear vs Exponential Comparison
const LinearVsExponential = () => {
  const [years, setYears] = useState(30);
  const [rate, setRate] = useState(7);
  const principal = 10000;
  const annualAddition = 1000;
  
  const data = useMemo(() => {
    const result = [];
    for (let year = 0; year <= years; year++) {
      const linear = principal + (annualAddition * year);
      const exponential = principal * Math.pow(1 + rate/100, year);
      result.push({
        year,
        linear: Math.round(linear),
        exponential: Math.round(exponential),
        difference: Math.round(exponential - linear)
      });
    }
    return result;
  }, [years, rate]);
  
  const finalLinear = data[data.length - 1]?.linear || 0;
  const finalExponential = data[data.length - 1]?.exponential || 0;
  const multiplier = (finalExponential / principal).toFixed(1);
  
  return (
    <div className="bg-gray-50 rounded-xl p-6 my-6">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Years</label>
          <input 
            type="range" 
            min="5" 
            max="50" 
            value={years} 
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center font-mono text-lg">{years} years</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Annual Return</label>
          <input 
            type="range" 
            min="1" 
            max="15" 
            value={rate} 
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center font-mono text-lg">{rate}%</div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="year" label={{ value: 'Years', position: 'bottom', offset: -5 }} />
          <YAxis tickFormatter={(v) => formatCurrency(v)} width={80} />
          <Tooltip formatter={(v) => formatCurrency(v)} />
          <Legend />
          <Area type="monotone" dataKey="linear" name="Linear (adding $1K/yr)" stroke="#94a3b8" fill="#e2e8f0" />
          <Area type="monotone" dataKey="exponential" name="Compound Growth" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.6} />
        </AreaChart>
      </ResponsiveContainer>
      
      <div className="grid grid-cols-3 gap-4 mt-6 text-center">
        <div className="bg-gray-200 rounded-lg p-3">
          <div className="text-sm text-gray-600">Linear</div>
          <div className="text-xl font-bold text-gray-700">{formatCurrency(finalLinear)}</div>
        </div>
        <div className="bg-blue-100 rounded-lg p-3">
          <div className="text-sm text-blue-600">Compound</div>
          <div className="text-xl font-bold text-blue-700">{formatCurrency(finalExponential)}</div>
        </div>
        <div className="bg-green-100 rounded-lg p-3">
          <div className="text-sm text-green-600">Multiplier</div>
          <div className="text-xl font-bold text-green-700">{multiplier}x</div>
        </div>
      </div>
    </div>
  );
};

// The Penny Doubling Game
const PennyDoubling = () => {
  const [day, setDay] = useState(30);
  
  const data = useMemo(() => {
    const result = [];
    for (let d = 1; d <= day; d++) {
      const pennies = Math.pow(2, d - 1);
      const dollars = pennies / 100;
      const million = 1000000 * d; // $1M per day option
      result.push({
        day: d,
        penny: dollars,
        million: million,
        pennyLabel: dollars >= 1000000 ? `$${(dollars/1000000).toFixed(1)}M` : dollars >= 1000 ? `$${(dollars/1000).toFixed(0)}K` : `$${dollars.toFixed(2)}`
      });
    }
    return result;
  }, [day]);
  
  const finalPenny = Math.pow(2, day - 1) / 100;
  const finalMillion = 1000000 * day;
  const pennyWins = finalPenny > finalMillion;
  
  return (
    <div className="bg-gray-50 rounded-xl p-6 my-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">Number of Days</label>
        <input 
          type="range" 
          min="10" 
          max="35" 
          value={day} 
          onChange={(e) => setDay(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-center font-mono text-lg">{day} days</div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`rounded-lg p-4 ${pennyWins ? 'bg-green-100 ring-2 ring-green-500' : 'bg-gray-100'}`}>
          <div className="text-sm font-medium text-gray-600">Option A: Penny Doubling</div>
          <div className="text-2xl font-bold text-gray-800">{formatCurrency(finalPenny)}</div>
          <div className="text-xs text-gray-500">Doubles each day</div>
        </div>
        <div className={`rounded-lg p-4 ${!pennyWins ? 'bg-green-100 ring-2 ring-green-500' : 'bg-gray-100'}`}>
          <div className="text-sm font-medium text-gray-600">Option B: $1M per Day</div>
          <div className="text-2xl font-bold text-gray-800">{formatCurrency(finalMillion)}</div>
          <div className="text-xs text-gray-500">Flat $1M daily</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 border">
        <div className="text-sm font-medium text-gray-600 mb-2">Daily Breakdown (last 10 days)</div>
        <div className="grid grid-cols-5 gap-2 text-xs">
          {data.slice(-10).map((d) => (
            <div key={d.day} className="text-center">
              <div className="text-gray-500">Day {d.day}</div>
              <div className="font-mono font-bold text-blue-600">{d.pennyLabel}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        {pennyWins 
          ? `🎉 The penny wins by ${formatCurrency(finalPenny - finalMillion)}!`
          : `The $1M/day option is still ahead by ${formatCurrency(finalMillion - finalPenny)}`
        }
      </div>
    </div>
  );
};

// Rule of 72 Calculator
const RuleOf72 = () => {
  const [rate, setRate] = useState(8);
  
  const rule72 = 72 / rate;
  const actual = Math.log(2) / Math.log(1 + rate/100);
  const error = ((rule72 - actual) / actual * 100).toFixed(1);
  
  const rateExamples = [
    { name: "Savings Account", rate: 2, years: 36 },
    { name: "Bonds", rate: 5, years: 14.4 },
    { name: "Stock Market", rate: 10, years: 7.2 },
    { name: "Credit Card Debt", rate: 20, years: 3.6 },
  ];
  
  return (
    <div className="bg-gray-50 rounded-xl p-6 my-6">
      <div className="text-center mb-6">
        <div className="text-6xl font-bold text-blue-600 mb-2">72 ÷ {rate} = {rule72.toFixed(1)}</div>
        <div className="text-lg text-gray-600">years to double your money at {rate}% return</div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-1">Interest Rate</label>
        <input 
          type="range" 
          min="1" 
          max="25" 
          value={rate} 
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>1%</span>
          <span>25%</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg p-3 border">
          <div className="text-sm text-gray-600">Rule of 72</div>
          <div className="text-xl font-bold">{rule72.toFixed(2)} years</div>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <div className="text-sm text-gray-600">Actual Math</div>
          <div className="text-xl font-bold">{actual.toFixed(2)} years</div>
          <div className="text-xs text-gray-500">Error: {error}%</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 border">
        <div className="text-sm font-medium text-gray-600 mb-3">Quick Reference</div>
        <div className="grid grid-cols-4 gap-2">
          {rateExamples.map((ex) => (
            <div key={ex.name} className="text-center p-2 bg-gray-50 rounded">
              <div className="text-xs text-gray-500">{ex.name}</div>
              <div className="text-sm font-bold">{ex.rate}%</div>
              <div className="text-xs text-blue-600">{ex.years} yrs</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// The Power of Starting Early
const StartingEarly = () => {
  const [viewYears, setViewYears] = useState(40);
  const rate = 7;
  
  // Alice starts at 25, invests for 10 years, then stops
  // Bob starts at 35, invests until 65
  const data = useMemo(() => {
    const result = [];
    let aliceBalance = 0;
    let bobBalance = 0;
    const annualInvestment = 5000;
    
    for (let age = 25; age <= 65; age++) {
      // Alice invests from 25-34 (10 years)
      if (age <= 34) {
        aliceBalance = (aliceBalance + annualInvestment) * (1 + rate/100);
      } else {
        aliceBalance = aliceBalance * (1 + rate/100);
      }
      
      // Bob invests from 35-65 (30 years)
      if (age >= 35) {
        bobBalance = (bobBalance + annualInvestment) * (1 + rate/100);
      }
      
      result.push({
        age,
        alice: Math.round(aliceBalance),
        bob: Math.round(bobBalance),
        aliceInvested: age <= 34 ? (age - 24) * annualInvestment : 10 * annualInvestment,
        bobInvested: age >= 35 ? (age - 34) * annualInvestment : 0
      });
    }
    return result;
  }, []);
  
  const finalData = data[data.length - 1];
  
  return (
    <div className="bg-gray-50 rounded-xl p-6 my-6">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-purple-100 rounded-lg p-4">
          <div className="text-sm font-medium text-purple-600">👩 Alice (starts at 25)</div>
          <div className="text-xs text-purple-500 mb-2">Invests $5K/yr for 10 years, then stops</div>
          <div className="text-2xl font-bold text-purple-700">{formatCurrency(finalData.alice)}</div>
          <div className="text-xs text-purple-500">Total invested: $50,000</div>
        </div>
        <div className="bg-orange-100 rounded-lg p-4">
          <div className="text-sm font-medium text-orange-600">👨 Bob (starts at 35)</div>
          <div className="text-xs text-orange-500 mb-2">Invests $5K/yr for 30 years</div>
          <div className="text-2xl font-bold text-orange-700">{formatCurrency(finalData.bob)}</div>
          <div className="text-xs text-orange-500">Total invested: $150,000</div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="age" label={{ value: 'Age', position: 'bottom', offset: -5 }} />
          <YAxis tickFormatter={(v) => formatCurrency(v)} width={80} />
          <Tooltip formatter={(v) => formatCurrency(v)} />
          <Legend />
          <ReferenceLine x={35} stroke="#666" strokeDasharray="3 3" label="Bob starts" />
          <Area type="monotone" dataKey="alice" name="Alice" stroke="#9333ea" fill="#a855f7" fillOpacity={0.6} />
          <Area type="monotone" dataKey="bob" name="Bob" stroke="#ea580c" fill="#f97316" fillOpacity={0.6} />
        </AreaChart>
      </ResponsiveContainer>
      
      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <div className="text-lg font-bold text-yellow-800">
          Alice invested 3× less but ended up with {((finalData.alice / finalData.bob) * 100 - 100).toFixed(0)}% more!
        </div>
        <div className="text-sm text-yellow-700">
          The 10-year head start was worth more than 20 extra years of investing.
        </div>
      </div>
    </div>
  );
};

// Compound Frequency Comparison
const CompoundFrequency = () => {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(20);
  
  const frequencies = [
    { name: "Annual", n: 1 },
    { name: "Quarterly", n: 4 },
    { name: "Monthly", n: 12 },
    { name: "Daily", n: 365 },
    { name: "Continuous", n: Infinity }
  ];
  
  const results = frequencies.map(f => {
    let amount;
    if (f.n === Infinity) {
      amount = principal * Math.exp((rate/100) * years);
    } else {
      amount = principal * Math.pow(1 + (rate/100)/f.n, f.n * years);
    }
    return { ...f, amount: Math.round(amount) };
  });
  
  const effectiveRates = frequencies.map(f => {
    let effective;
    if (f.n === Infinity) {
      effective = (Math.exp(rate/100) - 1) * 100;
    } else {
      effective = (Math.pow(1 + (rate/100)/f.n, f.n) - 1) * 100;
    }
    return { ...f, effective: effective.toFixed(3) };
  });
  
  return (
    <div className="bg-gray-50 rounded-xl p-6 my-6">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Principal</label>
          <input 
            type="range" 
            min="1000" 
            max="100000" 
            step="1000"
            value={principal} 
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center font-mono">{formatCurrency(principal)}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Rate</label>
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={rate} 
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center font-mono">{rate}%</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Years</label>
          <input 
            type="range" 
            min="1" 
            max="40" 
            value={years} 
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center font-mono">{years} yrs</div>
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {results.map((r, i) => (
          <div key={r.name} className={`rounded-lg p-3 text-center ${i === results.length - 1 ? 'bg-green-100' : 'bg-white border'}`}>
            <div className="text-xs text-gray-500">{r.name}</div>
            <div className="text-lg font-bold">{formatCurrency(r.amount)}</div>
            <div className="text-xs text-blue-600">APY: {effectiveRates[i].effective}%</div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        Difference between annual and continuous: {formatCurrency(results[4].amount - results[0].amount)} ({((results[4].amount / results[0].amount - 1) * 100).toFixed(2)}% more)
      </div>
    </div>
  );
};

// Full Calculator
const FullCalculator = () => {
  const [principal, setPrincipal] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(30);
  
  const data = useMemo(() => {
    const result = [];
    let balance = principal;
    let totalContributed = principal;
    
    for (let year = 0; year <= years; year++) {
      result.push({
        year,
        balance: Math.round(balance),
        contributed: Math.round(totalContributed),
        interest: Math.round(balance - totalContributed)
      });
      
      // Add monthly contributions with compound growth
      for (let month = 0; month < 12; month++) {
        balance = balance * (1 + rate/100/12) + monthly;
        totalContributed += monthly;
      }
    }
    return result;
  }, [principal, monthly, rate, years]);
  
  const final = data[data.length - 1];
  const interestPercent = ((final.interest / final.balance) * 100).toFixed(0);
  
  return (
    <div className="bg-gray-50 rounded-xl p-6 my-6">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Starting Amount</label>
          <input 
            type="range" 
            min="0" 
            max="100000" 
            step="1000"
            value={principal} 
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center font-mono text-sm">{formatCurrency(principal)}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Monthly Add</label>
          <input 
            type="range" 
            min="0" 
            max="2000" 
            step="50"
            value={monthly} 
            onChange={(e) => setMonthly(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center font-mono text-sm">${monthly}/mo</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Annual Return</label>
          <input 
            type="range" 
            min="1" 
            max="15" 
            value={rate} 
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center font-mono text-sm">{rate}%</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Years</label>
          <input 
            type="range" 
            min="5" 
            max="50" 
            value={years} 
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center font-mono text-sm">{years} years</div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={(v) => formatCurrency(v)} width={80} />
          <Tooltip formatter={(v) => formatCurrency(v)} />
          <Legend />
          <Area type="monotone" dataKey="contributed" name="Your Contributions" stackId="1" stroke="#94a3b8" fill="#cbd5e1" />
          <Area type="monotone" dataKey="interest" name="Interest Earned" stackId="1" stroke="#22c55e" fill="#4ade80" />
        </AreaChart>
      </ResponsiveContainer>
      
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-lg p-4 border text-center">
          <div className="text-sm text-gray-600">Total Balance</div>
          <div className="text-2xl font-bold text-gray-800">{formatCurrency(final.balance)}</div>
        </div>
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-600">You Contributed</div>
          <div className="text-2xl font-bold text-gray-700">{formatCurrency(final.contributed)}</div>
        </div>
        <div className="bg-green-100 rounded-lg p-4 text-center">
          <div className="text-sm text-green-600">Interest Earned</div>
          <div className="text-2xl font-bold text-green-700">{formatCurrency(final.interest)}</div>
          <div className="text-xs text-green-600">{interestPercent}% of total</div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function CompoundInterestExplainer() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* Back Link */}
      <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 text-sm">
        ← Back to all explainers
      </Link>
      {/* Header */}
      <div className="text-center mb-16 pt-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          The Mathematics of Patience
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Why Einstein (allegedly) called compound interest "the eighth wonder of the world" — 
          and why understanding it might be the most valuable hour you spend this year.
        </p>
      </div>
      
      {/* Opening Hook */}
      <div className="prose max-w-none mb-12">
        <p className="text-lg text-gray-700 leading-relaxed">
          Here's a question that reveals how poorly our brains understand exponential growth:
        </p>
        <p className="text-lg text-gray-700 leading-relaxed font-medium">
          Would you rather have <span className="text-blue-600">$1 million per day for 30 days</span>, 
          or <span className="text-green-600">a penny that doubles every day for 30 days</span>?
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          Most people instinctively grab the million. It sounds like an absurd amount of money — $30 million total!
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          The penny? Day 10, you have $5.12. Day 20, you have $5,242. It looks pathetic.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          But by Day 30, the penny is worth <strong className="text-green-600">$5.37 million</strong>. And if you waited just 10 more days, it would be worth <strong>$5.5 billion</strong>.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          This is the magic — and the danger — of exponential growth. Let's build your intuition until you can <em>feel</em> it.
        </p>
      </div>

      {/* Table of Contents - Inline Style */}
      <div className="mb-12 text-sm text-gray-500">
        <span className="font-semibold text-gray-600">Contents: </span>
        <a href="#section-1" className="text-blue-600 hover:underline">The Fundamental Difference</a>
        {" · "}
        <a href="#section-2" className="text-blue-600 hover:underline">The Penny Game</a>
        {" · "}
        <a href="#section-3" className="text-blue-600 hover:underline">Rule of 72</a>
        {" · "}
        <a href="#section-4" className="text-blue-600 hover:underline">Starting Early</a>
        {" · "}
        <a href="#section-5" className="text-blue-600 hover:underline">Compounding Frequency</a>
        {" · "}
        <a href="#section-6" className="text-blue-600 hover:underline">Your Projection</a>
        {" · "}
        <a href="#section-7" className="text-blue-600 hover:underline">Further Resources</a>
      </div>

      {/* Section 1 */}
      <Section number="I" title="Linear vs Exponential: The Fundamental Difference">
        <p className="text-gray-700 mb-4">
          <strong>Linear growth</strong> adds a fixed amount each period. Save $1,000/year and in 10 years you have $10,000. Simple.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Exponential growth</strong> multiplies by a fixed percentage. Your gains generate their own gains. 
          The growth <em>accelerates</em> over time.
        </p>
        <p className="text-gray-700 mb-6">
          The chart below shows $10,000 growing two ways. Adjust the years and rate to see how dramatically they diverge:
        </p>
        
        <LinearVsExponential />
        
        <Callout emoji="🔑" title="Key Insight">
          The curves look similar at first — that's the "flat part" that fools people. 
          The magic happens in the later years when compound growth explodes upward. 
          This is why patience is the secret weapon.
        </Callout>
      </Section>

      {/* Section 2 */}
      <Section number="II" title="The Penny Doubling Game">
        <p className="text-gray-700 mb-4">
          Let's revisit our opening question with an interactive simulation. Watch how the penny option 
          looks hopeless for most of the month, then suddenly explodes past the "safe" choice.
        </p>
        
        <PennyDoubling />
        
        <p className="text-gray-700 mb-4">
          Notice something crucial: on Day 27, the penny finally catches up to the cumulative $27 million. 
          Then in just 3 more days, it more than <em>doubles</em> that lead.
        </p>
        
        <Quiz 
          question="At what day does the penny first exceed $1 million?"
          answer="Day 28"
          explanation="On Day 27, the penny is worth $671,088.64. On Day 28, it doubles to $1,342,177.28 — finally crossing a million. This is 90% of the way through the period before reaching 3% of the final value!"
        />
        
        <Callout emoji="🧠" title="Why Our Brains Fail">
          Humans evolved to understand linear relationships. If you walk twice as far, you get twice as tired.
          Exponential growth breaks this intuition. Most of the "growth" happens in the final moments — 
          which is why people give up on investments, diets, and skills right before the breakthrough.
        </Callout>
      </Section>

      {/* Section 3 */}
      <Section number="III" title="The Rule of 72: Mental Math for Doubling">
        <p className="text-gray-700 mb-4">
          Here's a mental shortcut every investor should know: divide 72 by your interest rate to get 
          the approximate years to double your money.
        </p>
        <p className="text-gray-700 mb-6">
          At 6%? Your money doubles in ~12 years. At 12%? Just ~6 years. This simple trick lets you 
          do compound interest math in your head.
        </p>
        
        <RuleOf72 />
        
        <Quiz 
          question="If inflation averages 3% per year, how long until prices double?"
          answer="24 years (72 ÷ 3 = 24)"
          explanation="This is the dark side of compound growth. At 3% inflation, something that costs $100 today will cost $200 in 24 years. Your savings need to grow faster than this just to maintain purchasing power."
        />
        
        <Callout emoji="⚠️" title="The Rule Works Both Ways">
          Credit card debt at 24% APR? Your debt doubles every 3 years if unpaid. 
          A $5,000 balance becomes $10,000, then $20,000, then $40,000. 
          This is why high-interest debt is an emergency.
        </Callout>
      </Section>

      {/* Section 4 */}
      <Section number="IV" title="Why Starting Early Wins (Even If You Invest Less)">
        <p className="text-gray-700 mb-4">
          This might be the most important chart in personal finance. Meet Alice and Bob:
        </p>
        <ul className="list-disc ml-6 mb-6 text-gray-700">
          <li><strong>Alice</strong> starts investing at 25, puts in $5,000/year for just 10 years, then stops completely.</li>
          <li><strong>Bob</strong> waits until 35, then invests $5,000/year for 30 years straight.</li>
        </ul>
        <p className="text-gray-700 mb-6">
          Bob invests 3× more money over 3× more years. Surely he wins, right?
        </p>
        
        <StartingEarly />
        
        <p className="text-gray-700 mb-4">
          Alice wins — despite investing <strong>$100,000 less</strong> and stopping 30 years before retirement.
        </p>
        <p className="text-gray-700 mb-6">
          Her secret? Those first 10 years gave her money more time to compound. Each of her early dollars 
          had 40 years to grow, while Bob's first dollar only had 30 years.
        </p>
        
        <Callout emoji="⏰" title="Time > Money">
          The single most valuable asset in compound growth is <em>time</em>. 
          You cannot buy back years you didn't invest. 
          Starting with $100/month at 22 beats starting with $500/month at 35.
        </Callout>
        
        <Quiz 
          question="If you're 30 and haven't started investing, what's the best strategy?"
          answer="Start today, even with small amounts"
          explanation="The second-best time to start is NOW. Waiting for 'more money' or 'the right time' costs you the most valuable resource: compounding years. Even $50/month starting today beats $500/month starting in 5 years."
        />
      </Section>

      {/* Section 5 */}
      <Section number="V" title="Compounding Frequency: Does It Matter?">
        <p className="text-gray-700 mb-4">
          You've seen banks advertise "daily compounding" as if it's magic. How much does compounding frequency actually matter?
        </p>
        <p className="text-gray-700 mb-6">
          The formula for compound interest is: <code className="bg-gray-100 px-2 py-1 rounded">A = P(1 + r/n)^(nt)</code> where n is compounding frequency.
          Play with the sliders to see the real difference:
        </p>
        
        <CompoundFrequency />
        
        <p className="text-gray-700 mb-4">
          The truth? Compounding frequency matters <em>much less</em> than the rate or time. 
          Going from annual to continuous compounding might add 0.5% to your effective rate.
          But an extra percentage point of return, or an extra decade of time, changes everything.
        </p>
        
        <Callout emoji="📊" title="What Actually Matters">
          <ol className="list-decimal ml-4">
            <li><strong>Time</strong> — The most powerful factor, by far</li>
            <li><strong>Rate of return</strong> — Worth optimizing, but don't chase returns recklessly</li>
            <li><strong>Consistent contributions</strong> — Adding regularly beats timing the market</li>
            <li><strong>Compounding frequency</strong> — Nice to have, but don't stress about it</li>
          </ol>
        </Callout>
      </Section>

      {/* Section 6 */}
      <Section number="VI" title="Build Your Own Projection">
        <p className="text-gray-700 mb-6">
          Now let's get personal. Use this calculator to project your own wealth growth. 
          Watch how the green "interest earned" section grows to dominate your total — 
          that's compound interest doing the heavy lifting.
        </p>
        
        <FullCalculator />
        
        <Quiz 
          question="Looking at your projection: what percentage of the final balance is from interest vs. your contributions?"
          answer="Check the green section — it's usually 50-80% for long time horizons!"
          explanation="This is the magic. After 30+ years, most of your wealth isn't from money you saved — it's from money your money earned. You're being paid for your patience."
        />
      </Section>

      {/* Closing */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8 my-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">The Bottom Line</h2>
        <div className="text-gray-700 space-y-4">
          <p>
            Compound interest is simple math with profound consequences. The formula is just multiplication. 
            But applied over time, it creates wealth that feels like magic.
          </p>
          <p>
            The key insights to carry with you:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong>Start now.</strong> The best time was 10 years ago. The second best time is today.</li>
            <li><strong>Be patient.</strong> The hockey stick comes at the end. Most people quit too early.</li>
            <li><strong>Respect the math.</strong> It works for you (investments) or against you (debt). Choose wisely.</li>
            <li><strong>Think in doublings.</strong> Use the Rule of 72. Every doubling is a multiplication of all previous growth.</li>
          </ul>
          <p className="font-medium text-gray-800 mt-6">
            You don't need to be rich to benefit from compound interest. You need to be patient.
            The math rewards those who understand that wealth is built in decades, not days.
          </p>
        </div>
      </div>

      {/* Section 7: Further Resources */}
      <Section number="VII" title="Further Resources">
        <div className="space-y-4 text-gray-700">
          <p>
            If you want to go deeper into compound interest, exponential growth, and wealth building, 
            here are resources worth your time:
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div>
              <div className="font-semibold text-gray-800">📚 Books</div>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <span className="font-medium">"The Psychology of Money"</span> by Morgan Housel — 
                  Why behavior matters more than math in building wealth.
                </li>
                <li>
                  <span className="font-medium">"A Random Walk Down Wall Street"</span> by Burton Malkiel — 
                  The classic case for index investing and letting compound growth work.
                </li>
                <li>
                  <span className="font-medium">"The Simple Path to Wealth"</span> by JL Collins — 
                  Practical, no-nonsense guide to long-term investing.
                </li>
              </ul>
            </div>
            
            <div>
              <div className="font-semibold text-gray-800">🎥 Videos</div>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <span className="font-medium">3Blue1Brown: "Exponential Growth"</span> — 
                  Beautiful visualization of why exponentials fool our intuition (YouTube).
                </li>
                <li>
                  <span className="font-medium">Khan Academy: Compound Interest</span> — 
                  Step-by-step derivation of the formulas.
                </li>
              </ul>
            </div>
            
            <div>
              <div className="font-semibold text-gray-800">🔢 The Math</div>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <strong>Basic Formula:</strong> <code className="bg-gray-200 px-2 py-0.5 rounded">A = P(1 + r)^t</code> — 
                  Principal × (1 + rate) raised to time periods.
                </li>
                <li>
                  <strong>With Contributions:</strong> <code className="bg-gray-200 px-2 py-0.5 rounded">A = P(1+r)^t + PMT × [((1+r)^t - 1) / r]</code> — 
                  Adds regular payment stream.
                </li>
                <li>
                  <strong>Continuous:</strong> <code className="bg-gray-200 px-2 py-0.5 rounded">A = Pe^(rt)</code> — 
                  The limit as compounding frequency → infinity.
                </li>
                <li>
                  <strong>Rule of 72 derivation:</strong> Comes from solving <code className="bg-gray-200 px-2 py-0.5 rounded">2 = (1 + r)^t</code> and using 
                  the approximation <code className="bg-gray-200 px-2 py-0.5 rounded">ln(2) ≈ 0.693 ≈ 0.72</code> for easier mental math.
                </li>
              </ul>
            </div>
            
            <div>
              <div className="font-semibold text-gray-800">🔗 Tools</div>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <span className="font-medium">Investor.gov Compound Interest Calculator</span> — 
                  SEC's official calculator with clear explanations.
                </li>
                <li>
                  <span className="font-medium">Portfolio Visualizer</span> — 
                  Backtest historical returns with real market data.
                </li>
              </ul>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            Remember: understanding compound interest is just the first step. 
            The real magic happens when you <em>apply</em> it consistently over decades. 
            Start small, stay consistent, be patient.
          </p>
        </div>
      </Section>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-8 border-t">
        <p>An interactive explainer on compound interest and exponential growth.</p>
        <p className="mt-1">Play with the numbers. Build your intuition. Start investing.</p>
      </div>
    </div>
  );
}
