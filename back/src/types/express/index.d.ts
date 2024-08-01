import express from "express";
import { User } from '@_types/user';

declare global{
	namespace Express {
		export interface Request {
		  user?: User;
		}
	}
}
