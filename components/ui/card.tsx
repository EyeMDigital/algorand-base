"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

// A simple card container
export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow p-4 ${className}`}>      
      {children}
    </div>
  );
}

// CardHeader: title & description wrapper
export function CardHeader({ children, className = "" }: CardProps) {
  return (
    <div className={`mb-4 border-b border-gray-200 pb-2 ${className}`}>      
      {children}
    </div>
  );
}

// CardTitle: large bold text
export function CardTitle({ children, className = "" }: CardProps) {
  return (
    <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>
  );
}

// CardDescription: smaller, muted text
export function CardDescription({ children, className = "" }: CardProps) {
  return (
    <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
  );
}

// CardContent: the main content area
export function CardContent({ children, className = "" }: CardProps) {
  return <div className={`${className}`}>{children}</div>;
}
