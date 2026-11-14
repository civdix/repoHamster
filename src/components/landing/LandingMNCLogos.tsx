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
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-label="Amazon">
            <path d="M1.04 17.52q.1-.16.32-.02a21.3 21.3 0 0 0 10.88 2.9a21.5 21.5 0 0 0 7.74-1.46q.1-.04.29-.12t.27-.12a.356.356 0 0 1 .47.12q.17.24-.11.44q-.36.26-.92.6a15 15 0 0 1-3.84 1.58A16.2 16.2 0 0 1 12 22a16 16 0 0 1-5.9-1.09a16.3 16.3 0 0 1-4.98-3.07a.27.27 0 0 1-.12-.2a.2.2 0 0 1 .04-.12m6.02-5.7a4.04 4.04 0 0 1 .68-2.36A4.2 4.2 0 0 1 9.6 7.98a10 10 0 0 1 2.66-.66q.54-.06 1.76-.16v-.34a3.56 3.56 0 0 0-.28-1.72a1.5 1.5 0 0 0-1.32-.6h-.16a2.2 2.2 0 0 0-1.14.42a1.64 1.64 0 0 0-.62 1 .51.51 0 0 1-.4.46L7.8 6.1q-.34-.08-.34-.36a.6.6 0 0 1 .02-.14a3.83 3.83 0 0 1 1.67-2.64A6.27 6.27 0 0 1 12.26 2h.5a5.05 5.05 0 0 1 3.56 1.18 4 4 0 0 1 .37.43 4 4 0 0 1 .27.41 2 2 0 0 1 .18.52q.08.34.12.47a3 3 0 0 1 .06.56q.02.43.02.51v4.84a2.9 2.9 0 0 0 .15.95 2.5 2.5 0 0 0 .29.62q.14.19.46.61a.6.6 0 0 1 .12.32a.35.35 0 0 1-.16.28q-1.66 1.44-1.8 1.56a.56.56 0 0 1-.58.04q-.28-.24-.49-.46t-.3-.32a5 5 0 0 1-.29-.39q-.2-.29-.28-.39a4.9 4.9 0 0 1-2.2 1.52 6 6 0 0 1-1.68.2a3.5 3.5 0 0 1-2.53-.95 3.55 3.55 0 0 1-.99-2.69m3.44-.4a1.9 1.9 0 0 0 .39 1.25 1.3 1.3 0 0 0 1.05.47 1 1 0 0 0 .17-.02 1 1 0 0 1 .15-.02 2.03 2.03 0 0 0 1.3-1.08 3.1 3.1 0 0 0 .33-.83 4 4 0 0 0 .12-.73q.01-.28.01-.92v-.5a7.3 7.3 0 0 0-1.76.16 2.144 2.144 0 0 0-1.76 2.22m8.4 6.44a.6.6 0 0 1 .12-.16 3.1 3.1 0 0 1 .96-.46 6.5 6.5 0 0 1 1.48-.22 1.2 1.2 0 0 1 .38.02q.9.08 1.08.3a.66.66 0 0 1 .08.36v.14a4.6 4.6 0 0 1-.38 1.65 3.84 3.84 0 0 1-1.06 1.53.3.3 0 0 1-.18.08.2.2 0 0 1-.08-.02q-.12-.06-.06-.22a7.6 7.6 0 0 0 .74-2.42.5.5 0 0 0-.08-.32q-.2-.24-1.12-.24q-.34 0-.8.04q-.5.06-.92.12a.23.23 0 0 0-.16.12z" />
          </svg>
          <span className="font-bold text-sm tracking-tight font-sans">Amazon</span>
        </div>

        {/* Meta */}
        <div className="flex items-center space-x-1.5 text-[var(--gh-text)] hover:text-[var(--yellow-primary)] transition-colors">
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-label="Meta">
            <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a7 7 0 0 0 .265.86a5.3 5.3 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927c1.497 0 2.633-.671 3.965-2.444c.76-1.012 1.144-1.626 2.663-4.32l.756-1.339l.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314c1.046.987 1.992 1.22 3.06 1.22c1.075 0 1.876-.355 2.455-.843a3.7 3.7 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745c0-2.72-.681-5.357-2.084-7.45c-1.282-1.912-2.957-2.93-4.716-2.93c-1.047 0-2.088.467-3.053 1.308c-.652.57-1.257 1.29-1.82 2.05c-.69-.875-1.335-1.547-1.958-2.056c-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999c1.132 1.748 1.647 4.195 1.647 6.4c0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004c-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a45 45 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327c1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446c.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338c-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.26 2.26 0 0 1 1.088-.285Z" />
          </svg>
          <span className="font-bold text-sm tracking-tight font-sans">Meta</span>
        </div>

        {/* Uber */}
        <div className="flex items-center space-x-1.5 text-[var(--gh-text)] hover:text-[var(--yellow-primary)] transition-colors">
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-label="Uber">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.824c5.068 0 9.176 4.108 9.176 9.176s-4.108 9.176-9.176 9.176S2.824 17.068 2.824 12 6.932 2.824 12 2.824zm-3.529 4.764v9.824h7.058V7.588H8.471zm2.118 2.118h2.824v5.588h-2.824V9.706z" />
          </svg>
          <span className="font-bold text-sm tracking-tight font-sans">Uber</span>
        </div>

        {/* Atlassian */}
        <div className="flex items-center space-x-1.5 text-[var(--gh-text)] hover:text-[var(--yellow-primary)] transition-colors">
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-label="Atlassian">
            <path d="M7.12 11.084a.683.683 0 00-1.16.126L.075 22.974a.703.703 0 00.63 1.018h8.19a.678.678 0 00.63-.39c1.767-3.65.696-9.203-2.406-12.52zM11.434.386a15.515 15.515 0 00-.906 15.317l3.95 7.9a.703.703 0 00.628.388h8.19a.703.703 0 00.63-1.017L12.63.38a.664.664 0 00-1.196.006z" />
          </svg>
          <span className="font-bold text-sm tracking-tight font-sans">Atlassian</span>
        </div>

        {/* GeeksforGeeks */}
        <div className="flex items-center space-x-1.5 text-[var(--gh-text)] hover:text-[var(--yellow-primary)] transition-colors">
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-label="GeeksforGeeks">
            <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.13-.353h7.418a4.26 4.26 0 0 1-.368 1.008zm-11.99-.654a3.793 3.793 0 0 1-2.134 2.078 4.51 4.51 0 0 1-3.117.016 3.7 3.7 0 0 1-1.104-.695 2.652 2.652 0 0 1-.564-.745 4.221 4.221 0 0 1-.368-1.006H9.59c-.038.12-.08.238-.13.352zm14.501-1.758a3.849 3.849 0 0 0-.082-.475l-9.634-.008a3.932 3.932 0 0 1 1.143-2.348c.363-.35.79-.625 1.26-.809a3.97 3.97 0 0 1 4.484.957l1.521-1.49a5.7 5.7 0 0 0-1.922-1.357 6.283 6.283 0 0 0-2.544-.49 6.35 6.35 0 0 0-2.405.457 6.007 6.007 0 0 0-1.963 1.276 6.142 6.142 0 0 0-1.325 1.94 5.862 5.862 0 0 0-.466 1.864h-.063a5.857 5.857 0 0 0-.467-1.865 6.13 6.13 0 0 0-1.325-1.939A6 6 0 0 0 8.21 6.34a6.698 6.698 0 0 0-4.949.031A5.708 5.708 0 0 0 1.34 7.73l1.52 1.49a4.166 4.166 0 0 1 4.484-.958c.47.184.898.46 1.26.81.368.36.66.792.859 1.268.146.344.242.708.285 1.08l-9.635.008A4.714 4.714 0 0 0 0 12.457a6.493 6.493 0 0 0 .345 2.127 4.927 4.927 0 0 0 1.08 1.783c.528.56 1.17 1 1.88 1.293a6.454 6.454 0 0 0 2.504.457c.824.005 1.64-.15 2.404-.457a5.986 5.986 0 0 0 1.964-1.277 6.116 6.116 0 0 0 1.686-3.076h.273a6.13 6.13 0 0 0 1.686 3.077 5.99 5.99 0 0 0 1.964 1.276 6.345 6.345 0 0 0 2.405.457 6.45 6.45 0 0 0 2.502-.457 5.42 5.42 0 0 0 1.882-1.293 4.928 4.928 0 0 0 1.08-1.783A6.52 6.52 0 0 0 24 12.457a4.757 4.757 0 0 0-.039-.554z" />
          </svg>
          <span className="font-bold text-sm tracking-tight font-sans">GeeksforGeeks</span>
        </div>
      </div>
    </div>
  );
}
