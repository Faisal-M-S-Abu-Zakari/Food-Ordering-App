// now , i will create custom hook that help me to deal with redux logic
// this hook will wrap the redux built in hooks
// 1-useDispatch for dispatching action
// 2-useSelector to select the state
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";

// this custom hook will have the built in hook with the type that i made
// هان بتصير تعرف الاكشن يلي بتعمل اله ديسباتش ويلي هيرجع منه و كذلك لو انا بختار حاجة من الستيات هكون عارف ايه في جواها
// يعني بيكون عندك type safety
// so when i going to execuate action i call this hook
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
// so when i going to select State i call this hook
export const useAppSelector = useSelector.withTypes<RootState>();
