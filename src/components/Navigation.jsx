import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BsFillHouseFill, BsCollectionPlayFill, BsSearch } from 'react-icons/bs';

const Navigation = () => {
  const location = useLocation();

  return (
    <motion.nav 
      className="navigation"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link 
          to="/" 
          className={`nav-link ${location.pathname === '/' ? 'active-link' : ''}`}
        >
          <BsFillHouseFill className="nav-icon" /> Home
        </Link>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link 
          to="/queue" 
          className={`nav-link ${location.pathname === '/queue' ? 'active-link' : ''}`}
        >
          <BsCollectionPlayFill className="nav-icon" /> Queue
        </Link>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link 
          to="/search" 
          className={`nav-link ${location.pathname === '/search' ? 'active-link' : ''}`}
        >
          <BsSearch className="nav-icon" /> Search
        </Link>
      </motion.div>
    </motion.nav>
  );
};

export default Navigation;
