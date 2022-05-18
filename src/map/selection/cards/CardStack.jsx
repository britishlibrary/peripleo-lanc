import React, { forwardRef, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ANIMATION_DURATION = 0.2;

const CardStack = forwardRef((props, ref) => {

  const [ next, setNext ] = useState();
  const [ current, setCurrent ] = useState(props.cards[props.cards.length - 1]);
  const [ previous, setPrevious ] = useState();

  const [ duration, setDuration ] = useState(ANIMATION_DURATION);

  useEffect(() => {     
    if (props.reset) {
      setCurrent(props.cards[props.cards.length - 1]);
    } else {
      // Get index of current card in 'cards' array
      const currentIdx = props.cards.indexOf(current);

      if (currentIdx == -1) {
        // Card was removed - set 'previous' to top-most...
        setPrevious(props.cards[props.cards.length - 1]);

        // ..and current to null
        setCurrent(null);

        // Set to null for the following swap previous -> current
        setDuration(0);
      } else if (props.cards.length > currentIdx + 1) {
        // Card was added at the end - set as next
        // setPrevious(null);
        setNext(props.cards[props.cards.length - 1]);
      }
    }
  }, [ props.cards ]);

  const onEntryComplete = () => {
    // Next card becomes the current card
    setCurrent(next);
    setNext(null);

    // Reset duration
    setDuration(ANIMATION_DURATION);
  }

  const onExitComplete = () => {
    // Previous card becomes the current card
    setCurrent(props.cards[props.cards.length - 1]);
    setPrevious(null);

    // Reset duration
    setDuration(ANIMATION_DURATION);
  }

  return (
    <div ref={ref} className="cardstack">
      <AnimatePresence initial={false}>
        {previous && 
          <motion.div 
            className="card previous"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}>
            {props.render(previous)}
          </motion.div>
        }
      </AnimatePresence>

      <AnimatePresence>
        {!previous && 
          <motion.div
            className="card current"
            initial={{ 
              left: 0 
            }}
            exit={{ 
              opacity: 0,
              left: 440 
            }}
            transition={{ duration }}
            onAnimationComplete={onExitComplete}>
            {props.render(current)}
          </motion.div>
        }
      </AnimatePresence>

      <AnimatePresence>
        {next && 
          <motion.div 
            className="card next"
            initial={{ 
              left: 440 
            }}
            animate={{ 
              left: 0 
            }}
            transition={{ duration: ANIMATION_DURATION }}
            onAnimationComplete={onEntryComplete}>
            {props.render(next)}
          </motion.div>
        }
      </AnimatePresence>
    </div>
  )

})

export default CardStack;
