// app/(auth)/layout.tsx
import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='relative min-h-screen  p-4'>
      {/* Subtle Grid Background */}
      <div className='pointer-events-none absolute inset-0 z-0'>
        {/* Enhanced radial gradient using semantic colors */}
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,theme(colors.primary.DEFAULT)_0%,theme(colors.secondary.DEFAULT)_60%,transparent_100%)]" />
        {/* Subtle grid using semantic color */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,theme(colors.secondary.DEFAULT)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.secondary.DEFAULT)_1px,transparent_1px)] bg-[size:20px_20px]" />
        {/* Accent gradient overlay for vibrance */}
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(135deg,theme(colors.accent.DEFAULT)_0%,transparent_80%)] opacity-20" />
      </div>

      {/* Centered Content Container */}
      <div className='relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='w-full max-w-md space-y-8 rounded-xl border border-border bg-card/80 p-8 shadow-2xl backdrop-blur-md'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
