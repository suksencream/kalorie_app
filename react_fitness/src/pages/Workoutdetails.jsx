import { useParams } from "react-router-dom";
import { useState } from "react";
import "./Workoutdetails.css";
import absImg from "../assets/abs.svg";
import buttImg from "../assets/butt.svg"
import thighImg from "../assets/thigh.svg"
import jjacksImg from "../assets/jumpingjack.svg";
import rtwistImg from "../assets/russiantwist.svg";
import mclimberImg from "../assets/mountainclimber.svg";
import fkickImg from "../assets/flutterkick.svg";
import plankImg from "../assets/plank.svg";
import bkicksImg from "../assets/bkicks.svg"
import squatsImg from "../assets/squats.svg"
import bbridgeImg from "../assets/bbridge.svg"
import sgkickImg from "../assets/sgkicks.svg"
import dkicksImg from "../assets/dkicks.svg"
import blungesImg from "../assets/blunges.svg"
import mburpeesImg from "../assets/mburpees.svg"
import rcrunchesImg from "../assets/rcrunches.svg"
import htouchImg from "../assets/htouch.svg"
import ssquatsImg from "../assets/ssquats.svg"
import shopImg from "../assets/shop.svg"
import lungesImg from "../assets/lunges.svg"
import fhydrantImg from "../assets/fhydrant.svg"
import ckplankImg from "../assets/ckplank.svg"
import cacrunchesImg from "../assets/cacrunches.svg"
import vholdImg from "../assets/vhold.svg"
import clungesImg from "../assets/clunges.svg"
import susquatsImg from "../assets/susquats.svg"
import slungesImg from "../assets/slunges.svg"
import jsquatsImg from "../assets/jsquats.svg"
import burpeesImg from "../assets/burpees.svg"

const workoutData = {
  "abs-beginner": {
    title: "Abs Beginner",
    minutes: 12,
    Img: absImg,
    workouts: [
      { id: 1, name: "Jumping Jacks", reps: "00:30 (x 2)", image: jjacksImg, description: "Start with your feet together and your arms by your sides, then jump up with your feet apart and your hands overhead." },
      { id: 2, name: "Russian Twist", reps: "x 16 (x 2)", image: rtwistImg, description: "Twist your torso from side to side while keeping your core engaged." },
      { id: 3, name: "Mountain Climber", reps: "x 18 (x 2)", image: mclimberImg, description: "Quickly bring knees toward the chest in a push-up position." },
      { id: 4, name: "Flutter Kicks", reps: "00:15 (x 2)", image: fkickImg, description: "Lie on your back and alternate lifting your legs in a controlled motion." },
      { id: 5, name: "Plank", reps: "00:30 (x 2)", image: plankImg, description: "Hold a push-up position while keeping your core tight." },
    ],
  },
  "butt-beginner": {
    title: "Butt Beginner",
    minutes: 11,
    Img: buttImg,
    workouts: [
      { id: 1, name: "Butt Kicks", reps: "00:30 (x 2)", image: bkicksImg, description: "Stand up on the floor, then run in place while kicking your heel up to touch your butt with each step." },
      { id: 2, name: "Squats", reps: "x 12 (x 2)", image: squatsImg, description: "Stand with your feet shoulder width apart and your arms stretched forward, then lower your body until your thighs are parallel with the floor." },
      { id: 3, name: "Butt Bridge", reps: "x 10 (x 2)", image: bbridgeImg, description: "Lie on your back with knees bent and feet flat on the floor. Put your arms flat at your sides." },
      { id: 4, name: "Standing Glute Kickbacks", reps: "x 20 (x 2)", image: sgkickImg, description: "Stand straight with arms akimbo, then kick your leg backwards and extend it as far as you can, meanwhile keep your legs and back straight and head up." },
      { id: 5, name: "Donkey Kicks", reps: "x 20 (x 2)", image: dkicksImg, description: "Start on all fours with your knees under your butt and your hands under your shoulders, lift your leg and squeeze your butt as much as you can." },
    ],
  },
  "thigh-beginner": {
    title: "Thigh Beginner",
    minutes: 12,
    Img: thighImg,
    workouts: [
      { id: 1, name: "Jumping Jacks", reps: "00:30 (x 2)", image: jjacksImg, description: "Start with your feet together and your arms by your sides, then jump up with your feet apart and your hands overhead." },
      { id: 2, name: "Squats", reps: "x 12 (x 2)", image: squatsImg, description: "Stand with your feet shoulder width apart and your arms stretched forward, then lower your body until your thighs are parallel with the floor." },
      { id: 3, name: "Donkey Kicks", reps: "x 20 (x 2)", image: dkicksImg, description: "Start on all fours with your knees under your butt and your hands under your shoulders, lift your leg and squeeze your butt as much as you can." },
      { id: 4, name: "Backward Lunge", reps: "x 14 (x 2)", image: blungesImg, description: "Stand with your feet shoulder width apart and your hands on your hips. Step a big step backward with your leg and lower your body until the other thigh is parallel to the floor." },
      { id: 5, name: "Modified Burpees", reps: "x 5 (x 2)", image: mburpeesImg, description: "Stand with your feet shoulder width apart. Put your hands on the ground and kick your feet backward, then bring your feet back and jump up." },
    ],
  },
  
  "abs-inter": {
    title: "Abs Intermediate",
    minutes: 17,
    Img: absImg,
    workouts: [
      { id: 1, name: "Jumping Jacks", reps: "00:30 (x 2)", image: jjacksImg, description: "Start with your feet together and your arms by your sides, then jump up with your feet apart and your hands overhead." },
      { id: 2, name: "Reverse Crunches", reps: "x 18 (x 2)", image: rcrunchesImg, description: "Lie on your back with your knees up at a 90 degree angle and your hands behind your head. Lift your upper body and thighs, and then stretch out." },
      { id: 3, name: "Mountain Climber", reps: "x 24 (x 2)", image: mclimberImg, description: "Quickly bring knees toward the chest in a push-up position." },
      { id: 4, name: "Heel Touch", reps: "x 20 (x 2)", image: htouchImg, description: "Lie on the ground with your legs bent and your arms by your sides. Slightly lift your upper body off the floor and make your hands reach your heels." },
      { id: 5, name: "Plank", reps: "00:45 (x 2)", image: plankImg, description: "Hold a push-up position while keeping your core tight." },
    ],
  },
  "butt-inter": {
    title: "Butt Intermediate",
    minutes: 17,
    Img: buttImg,
    workouts: [
      { id: 1, name: "Butt Kicks", reps: "00:30 (x 2)", image: bkicksImg, description: "Stand up on the floor, then run in place while kicking your heel up to touch your butt with each step." },
      { id: 2, name: "Squats", reps: "x 12 (x 2)", image: squatsImg, description: "Stand with your feet shoulder width apart and your arms stretched forward, then lower your body until your thighs are parallel with the floor." },
      { id: 3, name: "Butt Bridge", reps: "x 12 (x 2)", image: bbridgeImg, description: "Lie on your back with knees bent and feet flat on the floor. Put your arms flat at your sides." },
      { id: 4, name: "Split Squat", reps: "x 16 (x 2)", image: ssquatsImg, description: "Take a big step forward with your leg and keep your upper body straight, then make your body go straight up and down." },
      { id: 5, name: "Donkey Kicks", reps: "x 24 (x 2)", image: dkicksImg, description: "Start on all fours with your knees under your butt and your hands under your shoulders, lift your leg and squeeze your butt as much as you can." },
    ],
  },
  "thigh-inter": {
    title: "Thigh Intermediate",
    minutes: 16,
    Img: thighImg,
    workouts: [
      { id: 1, name: "Side Hop", reps: "00:30 (x 2)", image: shopImg, description: "Stand on the floor, put your hands in front of you and hop from side to side." },
      { id: 2, name: "Lunges", reps: "x 14 (x 2)", image: lungesImg, description: "Stand with your feet shoulder width apart and your arms stretched forward, then lower your body until your thighs are parallel with the floor." },
      { id: 3, name: "Donkey Kicks", reps: "x 24 (x 2)", image: dkicksImg, description: "Start on all fours with your knees under your butt and your hands under your shoulders, lift your leg and squeeze your butt as much as you can." },
      { id: 4, name: "Fire Hydrant", reps: "x 24 (x 2)", image: fhydrantImg, description: "Start on all fours with your knees under your butt and your hands under your shoulders, then lift your leg to the side at a 90 degree angle." },
      { id: 5, name: "Modified Burpees", reps: "x 5 (x 2)", image: mburpeesImg, description: "Stand with your feet shoulder width apart. Put your hands on the ground and kick your feet backward, then bring your feet back and jump up." },
    ],
  },

  "abs-ad": {
    title: "Abs Advanced",
    minutes: 25,
    Img: absImg,
    workouts: [
      { id: 1, name: "Cross Knee Plank", reps: "x 28 (x 2)", image: ckplankImg, description: "Start with the plank position. Bring one knee and the opposite elbow in touch each other, then bring them back." },
      { id: 2, name: "Cross Arm Crunches", reps: "x 18 (x 2)", image: cacrunchesImg, description: "Lie down and bend your knees with your feet flat. Lift your head and shoulders up to make a 30 degree angle with the ground, with your arms crossed." },
      { id: 3, name: "Heel Touch", reps: "x 24 (x 2)", image: htouchImg, description: "Lie on the ground with your legs bent and your arms by your sides. Slightly lift your upper body off the floor and make your hands reach your heels." },
      { id: 4, name: "V-hold", reps: "00:30 (x 2)", image: vholdImg, description: "Sit on the floor, lift your legs up at 45 degree angle, and lean your upper body back at 45 degree. Stretch arms forward. Hold this position." },
      { id: 5, name: "Plank", reps: "01:00 (x 2)", image: plankImg, description: "Hold a push-up position while keeping your core tight." },
    ],
  },
  "butt-ad": {
    title: "Butt Advanced",
    minutes: 24,
    Img: buttImg,
    workouts: [
      { id: 1, name: "Butt Kicks", reps: "00:30 (x 2)", image: bkicksImg, description: "Stand up on the floor, then run in place while kicking your heel up to touch your butt with each step." },
      { id: 2, name: "Squats", reps: "x 15 (x 2)", image: squatsImg, description: "Stand with your feet shoulder width apart and your arms stretched forward, then lower your body until your thighs are parallel with the floor." },
      { id: 3, name: "Butt Bridge", reps: "x 15 (x 2)", image: bbridgeImg, description: "Lie on your back with knees bent and feet flat on the floor. Put your arms flat at your sides." },
      { id: 4, name: "Curtsy Lunges", reps: "x 14 (x 2)", image: clungesImg, description: "Stand straight up, then step back with your left leg to the right, bend your knees at the same time. Go back to the start position and switch legs." },
      { id: 5, name: "Sumo Squats", reps: "x 15 (x 2)", image: susquatsImg, description: "Stand with your feet 6-12 inches apart and your arms in front of you, then lower your body until your thighs are parallel with the floor." },
    ],
  },
  "thigh-ad": {
    title: "Thigh Advanced",
    minutes: 21,
    Img: thighImg,
    workouts: [
      { id: 1, name: "Modified Burpees", reps: "x 10 (x 2)", image: mburpeesImg, description: "Stand with your feet shoulder width apart. Put your hands on the ground and kick your feet backward, then bring your feet back and jump up." },
      { id: 2, name: "Squats", reps: "x 15 (x 2)", image: squatsImg, description: "Stand with your feet shoulder width apart and your arms stretched forward, then lower your body until your thighs are parallel with the floor." },
      { id: 3, name: "Side Lunges", reps: "x 14 (x 2)", image: slungesImg, description: "Stand straight with your feet together. Move your leg to the side, then lower your body while keeping other leg straight." },
      { id: 4, name: "Jump Squats", reps: "x 12 (x 2)", image: jsquatsImg, description: "Start in the squat position, then jump up using your abdominal muscles for strength." },
      { id: 5, name: "Burpees", reps: "x 6 (x 2)", image: burpeesImg, description: "Stand with your feet shoulder width apart, then put your hands on the ground and kick your feet backward. Do a quick push-up and then jump up." },
    ],
  },

};

const WorkoutDetails = () => {
  const { id } = useParams();
  const selectedCategory = workoutData[id]; // Get the correct workout category
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  if (!selectedCategory) {
    return <p>Workout not found!</p>;
  }

  return (
    <div className="workout-list-page">
      <div className="workout-list-container">

        {/* Top Section: Title & Image */}
        <div className="workout-header">
          <div className="workout-text">
            <h2>{selectedCategory.title}</h2>
            <p>{selectedCategory.minutes} minutes | {selectedCategory.workouts.length} workouts</p>
          </div>
          <div className="workout-image">
            <img src={selectedCategory.Img} alt={selectedCategory.title} />
          </div>
        </div>

        {/* Workout Items */}
        <div className="workout-items">
          {selectedCategory.workouts.map((workout) => (
            <div className="workout-item" key={workout.id} onClick={() => setSelectedWorkout(workout)}>
              <img src={workout.image} alt={workout.name} />
              <p>{workout.name}</p>
              <span>{workout.reps}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Workout Details Modal */}
      {selectedWorkout && (
        <div className="modal-overlay" onClick={() => setSelectedWorkout(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedWorkout(null)}>×</button>
            <h2>{selectedWorkout.name}</h2>
            <img src={selectedWorkout.image} alt={selectedWorkout.name} />
            <p><strong>{selectedWorkout.reps}</strong></p>
            <p>{selectedWorkout.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutDetails;
