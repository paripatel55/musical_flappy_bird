import { useCallback } from "react"
import { useEffect, useState } from "react";
import styled from "styled-components"
const WALL_HEIGHT = 600; 
const WALL_WIDTH = 400; 
const BIRD_HEIGHT = 28;
const BIRD_WIDTH = 33;
const GRAVITY = 2; 
const OBJ_WIDTH = 52; 
const OBJ_SPEED = 2;
const OBJ_GAP = 200; 

const App = () => {
  const [isStart, setIsStart] = useState(false); 
  const [birdpos, setBirdpos] = useState(300); 
  const [objHeight, setObjHeight] = useState(0); 
  const [objPos, setObjPos] = useState(WALL_WIDTH); 
  const [score, setScore] = useState(0); 
  const bottomObj = WALL_HEIGHT - OBJ_GAP - objHeight; 

  // makes the bird go down when not pressing space 
  useEffect(() => { 
    let birdVal; 
    if(birdpos < WALL_HEIGHT - BIRD_HEIGHT && isStart) { // checks if it is not already at the edge of wall 
      birdVal = setInterval(() => {
      setBirdpos((birdpos) => birdpos + GRAVITY); // speed it falls down 
    },24); 
    }
    return () => clearInterval(birdVal); 
  }, [birdpos, isStart]); 

  // handles the movement of the pipes across the screen 
  useEffect(() => {
    let objVal; 
    if (isStart && objPos >= -OBJ_WIDTH) {
      objVal = setInterval(() => {
        setObjPos((objPos) => objPos - OBJ_SPEED); 
      }, 24); // moves them every 24 milliseconds

      return () => {
        clearInterval(objVal); 
      };
    } else {
      setObjPos(WALL_WIDTH); // resets obstacle to the right side of screen 
      setObjHeight(Math.floor(Math.random() * (WALL_HEIGHT - OBJ_GAP))); // new size of pipe is generated 
      if (isStart) setScore((score) => score + 1); // update score if game is still on 
    }
  }, [isStart, objPos]); 

// checks for collision between bird and pipe 
  useEffect(() => {
    // boolean vars 
  let topObj = birdpos < objHeight; // checks if bird clashes with the top pipe 
  let botObj = birdpos + BIRD_HEIGHT > WALL_HEIGHT - bottomObj; // bottom pipe 

  if (
    // checks if in boundaries and collides 
    objPos < BIRD_WIDTH &&
    objPos + OBJ_WIDTH > 0 &&
    (topObj || botObj)
  ) {
    setIsStart(false);
    setBirdpos(300);
    setScore(0);
  }
}, [isStart, birdpos, objHeight, objPos, bottomObj]);

const handlerkeypress = useCallback((e) => { 
  if (!isStart && e.code === "ArrowUp"){
    setIsStart(true);
    console.log("game start")
  } 
  else if (birdpos < BIRD_HEIGHT){
    setBirdpos(0); 
    console.log("bird hits a obstacle")
  } 
  else if (e.key === "ArrowUp" && isStart){
    setBirdpos((birdpos) => birdpos - 50);
    console.log("weeee")
  } 
}, [isStart, birdpos]);



// outside component 
window.addEventListener("keydown", handlerkeypress); 

  return ( 
    <>
    <Container> 
  <Home onKeyDown={handlerkeypress} tabIndex="0">
    <Background height = {WALL_HEIGHT} width = {WALL_WIDTH }>
      {!isStart ? <Startgame>Click To Start</Startgame> : null}
      <Obj 
        height={objHeight}
        width={OBJ_WIDTH}
        left={objPos}
        top={0}
        deg={180}
      />
      <Bird 
      height ={BIRD_HEIGHT} 
      width={BIRD_WIDTH} 
      top={300} 
      left={100}
      />
      <Obj
      height={bottomObj}
      width={OBJ_WIDTH}
      left={objPos}
      top={WALL_HEIGHT - (objHeight + bottomObj)}
      deg={0}
      />
    </Background>
  </Home>
  <ScoreShow>Score: {score}</ScoreShow>
  </Container>
  </>
)}; 

export default App; 

const Home = styled.div`
  height: 100vh; 
  display: flex;  
  justify-content: center; 
  align-items: center; 
`;
const Background = styled.div`
  background-image: url("./images/background-day.png");
  background-repeat: no-repeat;
  background-size: ${(props) => props.width}px ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  position: relative;
  border: 2px solid black;
  position: relative;
  overflow: hidden; 
`;
const Bird = styled.div`
  position: absolute;
  background-image: url("./images/yellowbird-upflap.png");
  background-repeat: no-repeat;
  background-size: ${(props) => props.width}px ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
`; 
// start game button 
const Startgame = styled.div` 
position: relative;
top: 49%;
background-color: black; 
padding: 10px; 
width: 100px; 
left: 250px; 
margin-left: -55px; 
text-align: center; 
font-size: 20px; 
border-radius: 10px; 
color: #fff; 
`; 

const Obj = styled.div`
position: relative; 
background-image: url("./images/pipe-green.png"); 
width: ${(props) => props.width}px;
height: ${(props) => props.height}px;
top: ${(props) => props.top}px;
left: ${(props) => props.left}px;
transform: rotate(${props => props.deg}deg); 

`
const ScoreShow = styled.div`
position: absolute; 
text-align: center; 
align-items: center; 
top: 750px; 
background: transparent; 
background-color: red ;
padding: 10px;
font-size: 20px;
border-radius: 10px;
color: #fff;
`; 

const Container = styled.div`
display: flex; 
flex-direction: column; 
align-items: center; 
`;
