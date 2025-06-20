import { spawn } from "child_process";
import { createClient } from "@/lib/supabase/client";

interface MCPRequest {
  method: string;
  params: {
    name: string;
    arguments: Record<string, any>;
  };
}

interface MCPResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

class SupabaseMCPClient {
  private mcpProcess: any = null;
  private requestId = 0;
  private pendingRequests = new Map<
    number,
    { resolve: Function; reject: Function }
  >();

  async initializeMCPServer() {
    if (this.mcpProcess) {
      return;
    }

    this.mcpProcess = spawn("node", ["./mcp-servers/supabase-server.js"], {
      stdio: ["pipe", "pipe", "pipe"],
      cwd: process.cwd(),
    });

    this.mcpProcess.stdout.on("data", (data: Buffer) => {
      try {
        const response = JSON.parse(data.toString());
        const request = this.pendingRequests.get(response.id);
        if (request) {
          this.pendingRequests.delete(response.id);
          if (response.error) {
            request.reject(new Error(response.error.message));
          } else {
            request.resolve(response.result);
          }
        }
      } catch (error) {
        console.error("Failed to parse MCP response:", error);
      }
    });

    this.mcpProcess.stderr.on("data", (data: Buffer) => {
      console.error("MCP Server Error:", data.toString());
    });

    // Initialize Supabase connection through MCP
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      await this.callMCPTool("supabase_init", {
        url: supabaseUrl,
        key: supabaseKey,
      });
    }
  }

  private async callMCPTool(
    toolName: string,
    args: Record<string, any>
  ): Promise<MCPResponse> {
    if (!this.mcpProcess) {
      await this.initializeMCPServer();
    }

    return new Promise((resolve, reject) => {
      const id = ++this.requestId;
      const request: MCPRequest = {
        method: "tools/call",
        params: {
          name: toolName,
          arguments: args,
        },
      };

      this.pendingRequests.set(id, { resolve, reject });

      const message = JSON.stringify({
        jsonrpc: "2.0",
        id,
        ...request,
      });

      this.mcpProcess.stdin.write(message + "\n");

      // タイムアウト設定（30秒）
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error("MCP request timeout"));
        }
      }, 30000);
    });
  }

  // ユーザープロファイル作成
  async createUserProfile(
    userId: string,
    email: string,
    metadata?: Record<string, any>
  ) {
    return await this.callMCPTool("create_user_profile", {
      userId,
      email,
      metadata,
    });
  }

  // 検索履歴の保存
  async saveSearchHistory(
    userId: string,
    query: string,
    results: any[],
    summary?: string
  ) {
    return await this.callMCPTool("save_search_history", {
      userId,
      query,
      results,
      summary,
    });
  }

  // ユーザー設定の取得
  async getUserSettings(userId: string) {
    return await this.callMCPTool("get_user_settings", {
      userId,
    });
  }

  // ユーザー設定の更新
  async updateUserSettings(userId: string, settings: Record<string, any>) {
    return await this.callMCPTool("update_user_settings", {
      userId,
      settings,
    });
  }

  // MCPサーバーの終了
  async closeMCPServer() {
    if (this.mcpProcess) {
      this.mcpProcess.kill();
      this.mcpProcess = null;
    }
  }
}

// シングルトンインスタンス
let mcpClientInstance: SupabaseMCPClient | null = null;

export function getMCPClient(): SupabaseMCPClient {
  if (!mcpClientInstance) {
    mcpClientInstance = new SupabaseMCPClient();
  }
  return mcpClientInstance;
}

// ブラウザ環境での代替実装（MCPはサーバーサイドでのみ動作）
export class BrowserSupabaseClient {
  private supabase = createClient();

  async createUserProfile(
    userId: string,
    email: string,
    metadata?: Record<string, any>
  ) {
    const { data, error } = await this.supabase.from("user_profiles").insert([
      {
        id: userId,
        email,
        metadata: metadata || {},
      },
    ]);

    if (error) throw error;
    return data;
  }

  async saveSearchHistory(
    userId: string,
    query: string,
    results: any[],
    summary?: string
  ) {
    const { data, error } = await this.supabase.from("search_history").insert([
      {
        user_id: userId,
        query,
        selected_ais: results.map((r) => r.aiId),
        results,
        summary,
      },
    ]);

    if (error) throw error;
    return data;
  }

  async getUserSettings(userId: string) {
    const { data, error } = await this.supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  }

  async updateUserSettings(userId: string, settings: Record<string, any>) {
    const { data, error } = await this.supabase.from("user_settings").upsert([
      {
        user_id: userId,
        settings,
      },
    ]);

    if (error) throw error;
    return data;
  }
}

// 環境に応じてクライアントを選択
export function getSupabaseClient() {
  if (typeof window !== "undefined") {
    // ブラウザ環境
    return new BrowserSupabaseClient();
  } else {
    // サーバー環境（Node.js）
    return getMCPClient();
  }
}
