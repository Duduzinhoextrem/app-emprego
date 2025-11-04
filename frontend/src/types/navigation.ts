import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Task } from './index';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  RequestPasswordReset: undefined;
  ResetPassword: { token?: string };
  Tasks: undefined;
  NewTask: undefined;
  EditTask: { task: Task };
  Users: undefined;
};

export type TasksScreenProps = NativeStackScreenProps<RootStackParamList, 'Tasks'>;
export type NewTaskScreenProps = NativeStackScreenProps<RootStackParamList, 'NewTask'>;
export type EditTaskScreenProps = NativeStackScreenProps<RootStackParamList, 'EditTask'>;

