/* Add these styles to your components.css file */

/* Navigation Improvements */
.nav {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border-light);
  position: sticky;
  top: 72px;
  z-index: var(--z-sticky);
  box-shadow: var(--shadow-xs);
  padding: 0; /* Remove default padding */
}

.nav-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
  display: flex;
  gap: var(--space-md); /* Reduced gap for more compact layout */
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.nav-content::-webkit-scrollbar {
  display: none;
}

.nav-button {
  display: flex;
  align-items: center;
  padding: var(--space-sm) var(--space-md); /* Reduced padding */
  border: none;
  background: none;
  font-size: var(--font-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  gap: var(--space-xs); /* Reduced gap between icon and text */
  transition: var(--transition-base);
  border-bottom: 3px solid transparent;
  position: relative;
  overflow: hidden;
  white-space: nowrap; /* Prevent text wrapping */
  min-height: 48px; /* Consistent height */
}

.nav-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-secondary-50) 100%);
  opacity: 0;
  transition: var(--transition-base);
  z-index: -1;
}

.nav-button:hover::before {
  opacity: 1;
}

.nav-button:hover {
  color: var(--color-primary);
  transform: translateY(-1px);
}

.active-nav-button {
  border-bottom-color: var(--color-primary);
  color: var(--color-primary);
  background: linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-secondary-50) 100%);
}

.inactive-nav-button {
  color: var(--color-text-secondary);
}

/* Mobile Navigation Improvements */
@media (max-width: 768px) {
  .nav-content {
    padding: 0 var(--space-md);
    gap: var(--space-sm);
  }
  
  .nav-button {
    font-size: var(--font-xs);
    padding: var(--space-sm) var(--space-xs);
    gap: 4px;
  }
  
  .nav-button svg {
    width: 14px !important;
    height: 14px !important;
  }
}

@media (max-width: 480px) {
  .nav-button span {
    display: none; /* Hide text on very small screens, show only icons */
  }
  
  .nav-button {
    padding: var(--space-sm);
    min-width: 44px;
    justify-content: center;
  }
}