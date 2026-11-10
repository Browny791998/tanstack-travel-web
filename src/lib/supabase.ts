import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
export const supabaseAnonKey =
	import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Post = {
	id: string;
	title: string;
	content: string;
	created_at: string;
	status?: "published" | "draft";
};

export type Todo = {
	id: number | string;
	title: string;
	content: string;
	completed: boolean;
	status: "done" | "pending";
	category?: string;
};
