import React from 'react';

export function LandingMNCLogos() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Credibility Eyebrow */}
      <p className="text-center text-[13px] font-medium text-[var(--gh-text-secondary)] tracking-tight mb-6">
        Built by <span className="font-semibold text-[var(--gh-text)]">Shivam Dixit</span> • Used by professionals at
      </p>

      {/* Monochrome Brand Logos */}
      <div className="flex flex-wrap items-center justify-center gap-x-10 sm:gap-x-14 lg:gap-x-16 gap-y-6 opacity-65 hover:opacity-100 transition-opacity duration-300">
        {/* Google */}
        <div className="flex items-center space-x-2 text-[var(--gh-text)] hover:text-[var(--yellow-primary)] transition-colors">
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" aria-label="Google">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
          <span className="font-bold text-sm tracking-tight font-sans">Google</span>
        </div>

        {/* Microsoft */}
        <div className="flex items-center space-x-2 text-[var(--gh-text)] hover:text-[var(--yellow-primary)] transition-colors">
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-label="Microsoft">
            <path d="M0 0h11.377v11.377H0zM12.623 0H24v11.377H12.623zM0 12.623h11.377V24H0zM12.623 12.623H24V24H12.623z" />
          </svg>
          <span className="font-bold text-sm tracking-tight font-sans">Microsoft</span>
        </div>

        {/* Amazon */}
        <div className="flex items-center space-x-1.5 text-[var(--gh-text)] hover:text-[var(--yellow-primary)] transition-colors">
          <svg className="h-6 w-7 fill-current" viewBox="0 0 24 24" aria-label="Amazon">
            <path d="M13.923 14.195c-2.457 1.815-5.99 2.766-9.043 2.766-4.288 0-8.15-1.583-11.08-4.227-.23-.207-.025-.49.255-.333 3.167 1.782 6.993 2.86 10.957 2.86 2.72 0 5.727-.577 8.44-1.788.413-.184.757.28.471.722zm1.096-.99c-.313-.404-2.036-.242-2.812-.152-.236.027-.272-.185-.058-.335 1.385-.972 3.655-.692 4.025-.23.37.46-.098 2.753-1.408 3.822-.202.164-.393.076-.303-.14.298-.718.87-2.56.556-2.965zM13.623 4.25c.348 1.838.204 3.708-.432 5.467-.184.509-.43 1-.728 1.455-.262.398-.106.666.294.498 1.488-.624 2.593-1.87 3.08-3.414.507-1.611.36-3.447-.414-4.88-.135-.25-.386-.17-.433.09-.095.545-.71 2.378-1.367 3.125-.102.116-.017.317.126.307.728-.052 1.428-.426 1.868-.99.527-.674.75-1.536.606-2.383-.042-.249-.323-.33-.45-.125-.478.77-1.433 1.352-2.15 1.54z" />
          </svg>
          <span className="font-bold text-sm tracking-tight font-sans">Amazon</span>
        </div>

        {/* Meta */}
        <div className="flex items-center space-x-2 text-[var(--gh-text)] hover:text-[var(--yellow-primary)] transition-colors">
          <svg className="h-5 w-6 fill-current" viewBox="0 0 24 24" aria-label="Meta">
            <path d="M16.924 3.25c-2.176 0-3.957 1.15-5.074 2.784-1.117-1.634-2.898-2.784-5.074-2.784C3.018 3.25 0 6.438 0 10.667c0 4.889 3.52 8.784 7.697 8.784 2.316 0 4.195-1.134 5.378-2.793 1.183 1.66 3.062 2.793 5.378 2.793 4.177 0 7.697-3.895 7.697-8.784 0-4.229-3.018-7.417-6.776-7.417h-.45zm-10.148 13.91c-2.862 0-5.183-2.955-5.183-6.493 0-3.538 2.321-6.493 5.183-6.493 1.936 0 3.654 1.393 4.502 3.473-.398.814-.64 1.748-.64 2.748 0 1.205.352 2.327.91 3.272-1.077 2.13-2.775 3.493-4.772 3.493zm10.598 0c-1.997 0-3.695-1.363-4.772-3.493.558-.945.91-2.067.91-3.272 0-1-.242-1.934-.64-2.748.848-2.08 2.566-3.473 4.502-3.473 2.862 0 5.183 2.955 5.183 6.493 0 3.538-2.321 6.493-5.183 6.493z" />
          </svg>
          <span className="font-bold text-sm tracking-tight font-sans">Meta</span>
        </div>

        {/* Uber */}
        <div className="flex items-center space-x-1.5 text-[var(--gh-text)] hover:text-[var(--yellow-primary)] transition-colors">
          <svg className="h-4 w-12 fill-current" viewBox="0 0 72 24" aria-label="Uber">
            <path d="M9.8 17.5c-4.4 0-7.8-3.3-7.8-7.8V1h4.6v8.7c0 2 1.4 3.4 3.2 3.4s3.2-1.4 3.2-3.4V1h4.6v8.7c0 4.5-3.4 7.8-7.8 7.8zm17.5.3c-2.4 0-4.3-.8-5.3-2.1v1.8h-4.3V1h4.6v5.8c1-1.3 2.9-2.1 5-2.1 4.5 0 8 3.5 8 8.4s-3.5 8.7-8 8.7zm-.6-4.1c2.1 0 3.7-1.8 3.7-4.4s-1.6-4.4-3.7-4.4c-2.1 0-3.8 1.8-3.8 4.4s1.7 4.4 3.8 4.4zm18.3 4.1c-4.7 0-8.2-3.5-8.2-8.5s3.4-8.6 8-8.6c4.6 0 7.8 3.4 7.8 8.5v1.2H41.4c.4 2 2.2 3.3 4.3 3.3 1.8 0 3.2-.8 3.8-2l3.8 1.4c-1.3 2.7-4.3 4.7-8.3 4.7zm3.1-9c-.3-1.8-1.7-3.1-3.6-3.1-1.9 0-3.3 1.2-3.7 3.1h7.3zm13.1 9h-4.6V5h4.4v2c1-1.4 2.5-2.3 4.2-2.3.4 0 .9.1 1.3.2l-1 4.2c-.6-.2-1.2-.3-1.8-.3-1.5 0-2.5 1-2.5 3v6.2z" />
          </svg>
        </div>

        {/* Atlassian */}
        <div className="flex items-center space-x-2 text-[var(--gh-text)] hover:text-[var(--yellow-primary)] transition-colors">
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-label="Atlassian">
            <path d="M11.53 1.17c-.36.56-.25 1.31.25 1.74l4.24 3.63c.48.41 1.21.36 1.63-.12l5.12-5.83c.37-.42.34-1.06-.08-1.44-.42-.38-1.07-.35-1.45.07L16.6 4.6l-3.59-3.08c-.42-.36-1.05-.33-1.48.09l-.42.44v.02zm-3.64 5.92c-.36.55-.26 1.3.24 1.73l9.46 8.09c.48.41 1.21.36 1.63-.12l4.63-5.27c.37-.42.34-1.06-.08-1.44-.42-.38-1.07-.35-1.45.07l-3.66 4.17-8.79-7.52c-.43-.37-1.06-.34-1.48.08l-.5.51zM4.24 13.01c-.36.56-.25 1.31.25 1.74l14.68 12.56c.48.41 1.21.36 1.63-.12l3.05-3.48c.37-.42.34-1.06-.08-1.44-.42-.38-1.07-.35-1.45.07l-2.08 2.37-14.02-12c-.42-.36-1.05-.33-1.48.09l-.5.51z" />
          </svg>
          <span className="font-bold text-sm tracking-tight font-sans">Atlassian</span>
        </div>
      </div>
    </div>
  );
}
