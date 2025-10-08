"use client";
import React from "react";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-[#fff8e1] flex flex-col font-sans">
      {/* Modern Header with Glass Effect - Fixed */}
  <header className="w-full bg-[#fff8e1] backdrop-blur-lg py-4 px-6 flex items-center justify-between top-0 z-10 shadow-lg border-b-2 border-[#bfa76a]">
        <div className="flex items-center gap-3">
          <img src="/goldpe-logo.svg" alt="GoldPe Logo" className="h-10 w-10 transform hover:scale-105 transition-all duration-300" />
          <span className="text-2xl font-bold bg-gradient-to-r from-[#bfa76a] to-[#2d1a00] bg-clip-text text-transparent tracking-tight">GoldPe</span>
        </div>
        <nav className="hidden md:flex gap-10 text-base font-semibold text-[#2d1a00]">
         <a href="#lease" className="hover:text-[#bfa76a] transition-all duration-300">Lease</a>
          <a href="#partner" className="hover:text-[#bfa76a] transition-all duration-300">Partner With Us</a>
          <a href="#about" className="hover:text-[#bfa76a] transition-all duration-300">About Us</a>
        </nav>
        <div className="flex gap-3">
          <a href="/login" className="px-5 py-2 rounded-lg border border-[#bfa76a] text-[#2d1a00] font-semibold hover:bg-[#bfa76a] hover:text-white transition-all duration-300 hover:shadow-md">Login</a>
          <a href="/signup" className="px-5 py-2 rounded-lg bg-[#bfa76a] text-white font-semibold shadow-sm hover:shadow-md hover:translate-y-[-1px] transition-all duration-300">Sign Up</a>
        </div>
      </header>

      {/* Live Rates Section - Added */}
      <section className="w-full bg-gradient-to-r from-[#bfa76a] to-[#009688] py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-semibold text-white mb-1">Live Market Rates</h3>
            <p className="text-white/80 text-sm">Updated every 15 seconds</p>
          </div>
          <div className="flex gap-6 items-center flex-wrap justify-center">
            <div className="bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 text-center">
              <span className="text-white/80 text-xs">Gold (24K)</span>
              <div className="text-2xl font-bold text-white">₹7,250/g</div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 text-center">
              <span className="text-white/80 text-xs">Silver</span>
              <div className="text-2xl font-bold text-white">₹92/g</div>
            </div>
          </div>
          <a href="#buy" className="px-6 py-2 bg-white text-[#009688] rounded-lg font-semibold hover:bg-gray-100 transition-colors">Buy Now</a>
        </div>
      </section>

      {/* Hero Section - Increased Gap from Header */}
      <section className="container mx-auto max-w-7xl px-6 pt-16 pb-20 flex flex-col md:flex-row items-center justify-between gap-14">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center bg-[#009688]/20 text-[#009688] px-3 py-1 rounded-full text-sm font-semibold mb-4">
            Investments  Digital Gold
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#2d1a00] mb-4 leading-tight">Invest in Pure 24K Gold</h1>
          <p className="text-xl text-[#2d1a00] mb-6 max-w-xl">Secure your wealth with digital gold, starting at just ₹10. Enjoy bank-grade security and instant access to physical delivery.</p>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <a href="#buy" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#bfa76a] to-[#009688] text-white font-bold shadow-md hover:shadow-lg transition-all duration-300">
              Get Started
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            <a href="#learn" className="px-6 py-3 rounded-lg border-2 border-[#009688] text-[#009688] font-bold hover:bg-[#009688] hover:text-white transition-all duration-300">
              Learn More
            </a>
          </div>
          <div className="flex items-center gap-6 text-sm text-[#2d1a00]/70">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[#009688]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>99.9% Pure</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[#009688]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Insured Vaults</span>
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#bfa76a]/30 p-8 w-full max-w-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#bfa76a]/5 to-[#009688]/5 pointer-events-none"></div>
            <div className="absolute inset-0 rounded-2xl border-2 border-white/40 pointer-events-none" style={{boxShadow: '0 8px 32px 0 rgba(191,167,106,0.15)'}}></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-[#009688]">Buy Digital Gold</span>
                <span className="text-sm font-medium text-white bg-gradient-to-r from-[#009688] to-[#bfa76a] px-3 py-1 rounded-full">Live Price</span>
              </div>
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 mb-1">Current Buy Price</p>
                <p className="text-3xl font-bold text-[#bfa76a]">₹7,250.00/g</p>
                <p className="text-xs text-gray-500">24K 99.9% Pure</p>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Buy Amount</span>
                  <input type="number" placeholder="₹ 1,000" className="bg-transparent text-right text-lg font-semibold text-[#bfa76a] w-20 outline-none" />
                </div>
                <div className="text-xs text-center text-gray-600">
                  <span className="text-[#bfa76a] font-semibold">0.138g</span> of gold for ₹1,000
                </div>
              </div>
              <button className="w-full py-3 rounded-lg bg-gradient-to-r from-[#009688] to-[#bfa76a] text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                Buy Now → ₹1,000
              </button>
              <div className="text-xs text-center text-gray-500 mt-3">
                No charges. Free storage for life.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Section - Added */}
      <section className="container mx-auto max-w-7xl px-6 py-16">
        <div className="grid md:grid-cols-4 gap-8 items-center">
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-bold text-[#2d1a00] mb-2">10L+</h3>
            <p className="text-gray-600">Happy Investors</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-bold text-[#2d1a00] mb-2">₹500Cr+</h3>
            <p className="text-gray-600">Gold Invested</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-bold text-[#2d1a00] mb-2">100%+</h3>
            <p className="text-gray-600">Secure & Insured</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-bold text-[#2d1a00] mb-2">24/7</h3>
            <p className="text-gray-600">Customer Support</p>
          </div>
        </div>
      </section>

      {/* Hero Section with Glass Cards - Enhanced Glass Effect */}
      <section className="container mx-auto max-w-7xl flex flex-col md:flex-row items-stretch justify-center py-24 px-8 gap-12 bg-gradient-to-br">
        <div className="flex-1 flex flex-col justify-center items-start py-16 px-12 bg-white/80 backdrop-blur-xl text-[#2d1a00] rounded-3xl shadow-2xl border border-[#bfa76a]/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#009688]/5 to-[#bfa76a]/5"></div>
          <div className="absolute inset-0 rounded-3xl border-2 border-white/40 pointer-events-none" style={{boxShadow: '0 8px 32px 0 rgba(191,167,106,0.15)'}}></div>
          <div className="relative z-10">
            <div className="mb-4 text-lg font-semibold text-[#009688] bg-white/60 px-4 py-1 rounded-full inline-block backdrop-blur-sm border border-[#009688]/30">
              Investments  Gold
            </div>
            <h1 className="text-5xl font-extrabold mb-4 leading-tight">Buy Pure 24K Gold</h1>
            <h2 className="text-2xl font-semibold mb-6">Secure Your Financial Future Today</h2>
            <p className="text-gray-600 mb-8 max-w-md">Join millions of Indians who trust GoldPe for their gold investments. Start small, grow big.</p>
            <a href="#" className="group inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-[#009688] text-[#009688] font-bold bg-white shadow-lg hover:bg-[#009688] hover:text-white transition-all duration-300">
              Download the App
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-start py-16 px-12 bg-white/80 backdrop-blur-xl text-[#2d1a00] rounded-3xl shadow-2xl border border-[#bfa76a]/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#bfa76a]/5 to-[#009688]/5"></div>
          <div className="absolute inset-0 rounded-3xl border-2 border-white/40 pointer-events-none" style={{boxShadow: '0 8px 32px 0 rgba(191,167,106,0.15)'}}></div>
          <div className="relative z-10">
            <div className="mb-4 text-lg font-semibold text-[#bfa76a] bg-white/60 px-4 py-1 rounded-full inline-block backdrop-blur-sm border border-[#bfa76a]/30">
              Why Digital Gold?
            </div>
            <h2 className="text-3xl font-bold mb-6">GoldPe Makes Gold Simple</h2>
            <ul className="text-lg space-y-4 mb-8">
              {[
                "Buy or sell 24K gold instantly, anytime",
                "Bank-grade vaults, fully insured & secure",
                "Convert to coins or jewelry easily anywhere",
                "Start with as little as ₹10 - no lock-in"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-[#bfa76a] to-[#009688] flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a href="#solutions" className="group inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-[#bfa76a] text-[#bfa76a] font-bold bg-white shadow-lg hover:bg-[#bfa76a] hover:text-white transition-all duration-300">
              Explore Solutions
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section - Added */}
      <section className="container mx-auto max-w-7xl px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#2d1a00] mb-4">Everything You Need</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Complete gold investment platform with all essential features</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-[#bfa76a]/10">
            <div className="w-16 h-16 bg-gradient-to-br from-[#009688] to-[#bfa76a] rounded-xl flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#2d1a00] mb-3 text-center">Real-time Pricing</h3>
            <p className="text-gray-600 text-center mb-4">Live gold rates updated every 15 seconds with transparent pricing</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center gap-2"><span className="text-[#009688]">•</span> MCX-aligned rates</li>
              <li className="flex items-center gap-2"><span className="text-[#009688]">•</span> No hidden fees</li>
              <li className="flex items-center gap-2"><span className="text-[#009688]">•</span> Price alerts</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-[#bfa76a]/10">
            <div className="w-16 h-16 bg-gradient-to-br from-[#bfa76a] to-[#009688] rounded-xl flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#2d1a00] mb-3 text-center">Secure Storage</h3>
            <p className="text-gray-600 text-center mb-4">Your gold is stored in world-class insured vaults across India</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center gap-2"><span className="text-[#009688]">•</span> MMTC-PAMP vaults</li>
              <li className="flex items-center gap-2"><span className="text-[#009688]">•</span> Full insurance cover</li>
              <li className="flex items-center gap-2"><span className="text-[#009688]">•</span> Free lifetime storage</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-[#bfa76a]/10">
            <div className="w-16 h-16 bg-gradient-to-br from-[#009688] to-[#2d1a00] rounded-xl flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#2d1a00] mb-3 text-center">Easy Delivery</h3>
            <p className="text-gray-600 text-center mb-4">Convert digital gold to physical coins, bars or jewelry delivered to your door</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center gap-2"><span className="text-[#009688]">•</span> Free delivery above ₹5,000</li>
              <li className="flex items-center gap-2"><span className="text-[#009688]">•</span> Partner jewelers network</li>
              <li className="flex items-center gap-2"><span className="text-[#009688]">•</span> Same-day delivery in metros</li>
            </ul>
          </div>
        </div>
      </section>

  <section className="py-20 px-6 bg-white/80 backdrop-blur-xl border-t-4 border-b-4 border-[#bfa76a]/20 relative">
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-[#bfa76a]/30 to-[#009688]/20 rounded-full blur-2xl opacity-40"></div>
    <div className="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-br from-[#009688]/30 to-[#bfa76a]/20 rounded-full blur-2xl opacity-40"></div>
  </div>
  <div className="max-w-6xl mx-auto relative z-10">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-[#009688] mb-4">How GoldPe Works</h2>
      <p className="text-xl text-[#2d1a00]/80 max-w-2xl mx-auto">Just 4 simple steps to start your gold investment journey</p>
    </div>
    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
      {[
        { icon: '/step1.svg', title: 'Choose Amount', desc: 'Pick your investment in ₹ or grams, starting at ₹10.' },
        { icon: '/step2.svg', title: 'Secure Payment', desc: 'Pay safely with UPI, cards, or net banking.' },
        { icon: '/step3.svg', title: 'Gold Stored', desc: 'Gold secured in insured vaults with certificates.' },
        { icon: '/step4.svg', title: 'Manage Anytime', desc: 'Track, sell, or convert to physical gold 24/7.' },
      ].map((step, idx) => (
        <div key={idx} className="flex flex-col items-center text-center flex-1 min-w-[180px] relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 shadow-xl border-4 border-black/60">
            <img src={step.icon} alt={step.title} className="w-10 h-10" />
          </div>
          <div className="font-bold text-lg text-[#009688] mb-2">{step.title}</div>
          <div className="text-[#2d1a00]/80 text-base mb-2 max-w-xs">{step.desc}</div>
          {idx < 3 && (
            <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-0">
              <svg width="60" height="24" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 12 H50 L40 2" stroke="#bfa76a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
    <div className="text-center mt-16">
      <a href="#buy" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#009688] to-[#bfa76a] text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        Start Investing Today
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
    </div>
  </div>
</section>

      {/* Testimonials Section - Added */}
      <section className="container mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#2d1a00] mb-4">What Our Investors Say</h2>
          <p className="text-xl text-gray-600">Join 10 lakh+ happy customers who trust GoldPe</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              quote: "Started with ₹500, now my portfolio is worth ₹50,000! The app is so easy to use and the rates are always fair.",
              author: "Priya Sharma",
              role: "Teacher, Mumbai",
              rating: 5
            },
            {
              quote: "The physical delivery option is amazing. Got my 10g gold coin delivered within 2 days. Excellent service!",
              author: "Rahul Patel",
              role: "Engineer, Bangalore",
              rating: 5
            },
            {
              quote: "Love the recurring investment feature. I set ₹1000 monthly and it automatically buys gold for me. So convenient!",
              author: "Anita Desai",
              role: "Doctor, Delhi",
              rating: 5
            }
          ].map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-[#bfa76a]/10 hover:shadow-xl transition-shadow">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#ffa500]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-1.058a1 1 0 00-1.175 0l-2.8 1.058c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 italic mb-4 text-lg">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#009688] rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-[#2d1a00]">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section - Added */}
      <section className="container mx-auto max-w-4xl px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#2d1a00] mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">Everything you need to know before you start</p>
        </div>
        <div className="space-y-6">
          {[
            {
              q: "Is the gold I buy on GoldPe genuine?",
              a: "Yes! All gold purchased through GoldPe is 24K 99.9% pure and stored in MMTC-PAMP certified vaults. You receive a digital certificate of ownership with every purchase."
            },
            {
              q: "Can I convert my digital gold to physical gold?",
              a: "Absolutely! You can convert your digital gold to physical gold coins, bars, or even jewelry through our partner jewelers. Free delivery for orders above ₹5,000."
            },
            {
              q: "What are the charges for buying gold?",
              a: "Zero making charges! You pay only the live gold price plus 3% GST. Storage is completely free for life. No hidden fees or lock-in periods."
            },
            {
              q: "How secure is my investment?",
              a: "Your gold is stored in fully insured, bank-grade vaults. GoldPe is ISO 27001 certified for information security and follows RBI guidelines for digital gold."
            },
            {
              q: "Can I sell my gold anytime?",
              a: "Yes! Sell your gold instantly during market hours and receive money directly in your bank account within T+1 day. No minimum quantity restrictions."
            }
          ].map((faq, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#009688] hover:shadow-lg transition-shadow">
              <h4 className="text-lg font-semibold text-[#2d1a00] mb-2">{faq.q}</h4>
              <p className="text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <a href="/faq" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg border-2 border-[#009688] text-[#009688] font-bold hover:bg-[#009688] hover:text-white transition-all duration-300">
            View All FAQs
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>

      {/* Call to Action Section - Added */}
      <section className="bg-gradient-to-r from-[#009688] to-[#2d1a00] py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-white rounded-full mix-blend-multiply filter blur-xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Start Your Gold Journey?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">Join 10 lakh+ Indians securing their future with GoldPe. Start investing in gold from just ₹10 today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/download" className="px-8 py-4 bg-white text-[#009688] rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              Download App Now
            </a>
            <a href="#buy" className="px-8 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-[#009688] transition-all duration-300">
              Buy Gold Instantly
            </a>
          </div>
          <div className="mt-8 flex justify-center items-center gap-6">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Trusted by 10L+ users
            </div>
            <div className="w-px h-6 bg-white/30"></div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              100% Secure
            </div>
          </div>
        </div>
      </section>

    
    
      {/* Footer */}
  <footer className="w-full bg-white py-12 px-4 border-t-4 border-[#bfa76a]">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      {/* Brand & Description */}
      <div className="flex flex-col items-start gap-4">
        <div className="flex items-center gap-3 mb-2">
          <img src="/goldpe-logo.svg" alt="GoldPe Logo" className="h-10 w-10" />
          <span className="font-extrabold text-2xl text-[#bfa76a] tracking-tight">GoldPe</span>
        </div>
        <div className="text-gray-700 text-sm max-w-xs">GoldPe is a transparent, secure way to buy and accumulate 24K gold. Your gold is stored in insured vaults and can be converted to coins or jewelry anytime.</div>
      </div>
      {/* Links */}
      <div className="flex flex-col gap-2 text-sm font-medium text-gray-700">
        <div className="flex gap-6 mb-2">
          <a href="#solutions" className="hover:text-[#bfa76a] transition-colors">Solutions</a>
          <a href="#contact" className="hover:text-[#bfa76a] transition-colors">Contact</a>
          <a href="#trust" className="hover:text-[#bfa76a] transition-colors">Trust & Safety</a>
        </div>
        <div className="flex gap-6">
          <a href="#faq" className="hover:text-[#bfa76a] transition-colors">FAQ</a>
          <a href="#privacy" className="hover:text-[#bfa76a] transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-[#bfa76a] transition-colors">Terms of Use</a>
        </div>
      </div>
      {/* Contact & Social */}
      <div className="flex flex-col gap-3 items-start">
        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <svg className="w-5 h-5 text-[#bfa76a]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10v6a1 1 0 001 1h3m10-7h2a1 1 0 011 1v6a1 1 0 01-1 1h-2m-4 0h-4" /></svg>
          <span>888 1000 800</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <svg className="w-5 h-5 text-[#bfa76a]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12v1m0 4v1m-8-5v1m0 4v1m-4-5v1m0 4v1" /></svg>
          <span>support@goldpe.com</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <svg className="w-5 h-5 text-[#bfa76a]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a2 2 0 00-2.828 0l-4.243 4.243" /></svg>
          <span>Mumbai, India</span>
        </div>
        <div className="flex gap-3 mt-2">
          <a href="https://twitter.com" target="_blank" rel="noopener" className="hover:scale-110 transition-transform"><img src="/twitter.svg" alt="Twitter" className="h-6 w-6" /></a>
          <a href="https://facebook.com" target="_blank" rel="noopener" className="hover:scale-110 transition-transform"><img src="/facebook.svg" alt="Facebook" className="h-6 w-6" /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener" className="hover:scale-110 transition-transform"><img src="/instagram.svg" alt="Instagram" className="h-6 w-6" /></a>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-8 text-center text-gray-500 text-sm opacity-80">&copy; {new Date().getFullYear()} GoldPe. All rights reserved.</div>
  </footer>
    </div>
  );
}