import React from 'react'

const LegalLayout = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="min-h-screen pt-32 pb-20 bg-white">
    <div className="max-w-4xl mx-auto px-6">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-serif font-black text-primary mb-4 italic tracking-tight uppercase">{title}</h1>
        <div className="w-12 h-1 bg-accent mx-auto"></div>
      </div>
      <div className="prose prose-primary max-w-none text-primary/70 leading-relaxed space-y-8 font-medium">
        {children}
      </div>
    </div>
  </div>
)

export default LegalLayout
