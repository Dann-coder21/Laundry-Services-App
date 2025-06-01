
import { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';


export default function OrderService() {
  const [date, setDate] = useState(new Date(1746057600000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);



const onchange = (event, selectedDate) => {
   const currentDate = selectedDate || date;
   setShow(Platform.OS === 'ios');
   setDate(currentDate);
 }
const showMode = (currentMode) => {
   setShow(true);
   setMode(currentMode);
 }
const showDatepicker = () => {
   showMode('date');
 }
const showTimepicker = () => {
   showMode('time');
 }

}
