export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      agent_tools: {
        Row: {
          created_at: string
          description: string
          id: number
          input_schema: Json | null
          internal_description: string | null
          output_schema: Json | null
          tool_id: string
          tool_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          input_schema?: Json | null
          internal_description?: string | null
          output_schema?: Json | null
          tool_id: string
          tool_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          input_schema?: Json | null
          internal_description?: string | null
          output_schema?: Json | null
          tool_id?: string
          tool_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      agents_chat_later: {
        Row: {
          briefing: string | null
          channel_id: string | null
          created_at: string
          id: number
          last_message_at: string | null
          phone_br: string
          quotation_id: string | null
          send_at: string | null
          sent: boolean | null
          sent_at: string | null
          thread_id: string
          tries_count: number | null
        }
        Insert: {
          briefing?: string | null
          channel_id?: string | null
          created_at?: string
          id?: number
          last_message_at?: string | null
          phone_br: string
          quotation_id?: string | null
          send_at?: string | null
          sent?: boolean | null
          sent_at?: string | null
          thread_id: string
          tries_count?: number | null
        }
        Update: {
          briefing?: string | null
          channel_id?: string | null
          created_at?: string
          id?: number
          last_message_at?: string | null
          phone_br?: string
          quotation_id?: string | null
          send_at?: string | null
          sent?: boolean | null
          sent_at?: string | null
          thread_id?: string
          tries_count?: number | null
        }
        Relationships: []
      }
      agents_definitions: {
        Row: {
          agentId: string
          created_at: string
          hml_identity: string | null
          hml_other: string | null
          hml_prompt: string
          hml_rules: string | null
          id: number
          identity: string | null
          other: string | null
          prod_prompt: string
          rules: string | null
          title: string
          updated_at: string
          updated_by_email: string | null
          variables: string | null
        }
        Insert: {
          agentId: string
          created_at?: string
          hml_identity?: string | null
          hml_other?: string | null
          hml_prompt: string
          hml_rules?: string | null
          id?: number
          identity?: string | null
          other?: string | null
          prod_prompt: string
          rules?: string | null
          title: string
          updated_at?: string
          updated_by_email?: string | null
          variables?: string | null
        }
        Update: {
          agentId?: string
          created_at?: string
          hml_identity?: string | null
          hml_other?: string | null
          hml_prompt?: string
          hml_rules?: string | null
          id?: number
          identity?: string | null
          other?: string | null
          prod_prompt?: string
          rules?: string | null
          title?: string
          updated_at?: string
          updated_by_email?: string | null
          variables?: string | null
        }
        Relationships: []
      }
      agents_global_prompts: {
        Row: {
          agentId: string
          created_at: string
          enabled_hml: boolean
          enabled_prod: boolean
          id: number
          identity: string
          other: string | null
          rules: string
          updated_at: string | null
          updated_by_email: string | null
        }
        Insert: {
          agentId: string
          created_at?: string
          enabled_hml?: boolean
          enabled_prod?: boolean
          id?: number
          identity: string
          other?: string | null
          rules: string
          updated_at?: string | null
          updated_by_email?: string | null
        }
        Update: {
          agentId?: string
          created_at?: string
          enabled_hml?: boolean
          enabled_prod?: boolean
          id?: number
          identity?: string
          other?: string | null
          rules?: string
          updated_at?: string | null
          updated_by_email?: string | null
        }
        Relationships: []
      }
      agents_prompts_history: {
        Row: {
          agentId: string | null
          created_at: string
          id: number
          prompt: string | null
          updated_at: string | null
          updated_by_email: string | null
        }
        Insert: {
          agentId?: string | null
          created_at?: string
          id?: number
          prompt?: string | null
          updated_at?: string | null
          updated_by_email?: string | null
        }
        Update: {
          agentId?: string | null
          created_at?: string
          id?: number
          prompt?: string | null
          updated_at?: string | null
          updated_by_email?: string | null
        }
        Relationships: []
      }
      agents_recovery_verification: {
        Row: {
          channel_id: string | null
          conversation_id: string | null
          created_at: string
          id: number
          last_message_at: string
          phone_br: string
          thread_id: string
        }
        Insert: {
          channel_id?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: number
          last_message_at?: string
          phone_br: string
          thread_id: string
        }
        Update: {
          channel_id?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: number
          last_message_at?: string
          phone_br?: string
          thread_id?: string
        }
        Relationships: []
      }
      agents_v3: {
        Row: {
          agent_id: string
          agent_name: string
          created_at: string
          id: number
          prompt: string
          prompt_id: string
          published_for: string
          tools: string[] | null
          type: string
          updated_at: string
          updated_by_email: string | null
          variables: Json | null
        }
        Insert: {
          agent_id: string
          agent_name: string
          created_at?: string
          id?: number
          prompt: string
          prompt_id: string
          published_for: string
          tools?: string[] | null
          type: string
          updated_at?: string
          updated_by_email?: string | null
          variables?: Json | null
        }
        Update: {
          agent_id?: string
          agent_name?: string
          created_at?: string
          id?: number
          prompt?: string
          prompt_id?: string
          published_for?: string
          tools?: string[] | null
          type?: string
          updated_at?: string
          updated_by_email?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      agents_v4: {
        Row: {
          agent_id: string
          agent_name: string
          created_at: string
          description: string | null
          edited_by_email: string | null
          id: number
          model: string | null
          prompt_hml: string | null
          prompt_prd: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          agent_name: string
          created_at?: string
          description?: string | null
          edited_by_email?: string | null
          id?: number
          model?: string | null
          prompt_hml?: string | null
          prompt_prd?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          agent_name?: string
          created_at?: string
          description?: string | null
          edited_by_email?: string | null
          id?: number
          model?: string | null
          prompt_hml?: string | null
          prompt_prd?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_quotations: {
        Row: {
          additionalCollision: boolean | null
          additionalGlassProtection: boolean | null
          coupon: string | null
          created_at: string
          discount: number | null
          discountRecurrentFor: number | null
          fipe: string | null
          firstPaymentPrice: number | null
          id: string
          isServiceVehicle: boolean | null
          monthlyPrice: number | null
          phone: string
          plate: string | null
          priceWithoutDiscount: number | null
          quotationCreatedAt: string | null
          quotationId: string | null
          registrationFee: number | null
          vehicleType: string | null
        }
        Insert: {
          additionalCollision?: boolean | null
          additionalGlassProtection?: boolean | null
          coupon?: string | null
          created_at?: string
          discount?: number | null
          discountRecurrentFor?: number | null
          fipe?: string | null
          firstPaymentPrice?: number | null
          id?: string
          isServiceVehicle?: boolean | null
          monthlyPrice?: number | null
          phone: string
          plate?: string | null
          priceWithoutDiscount?: number | null
          quotationCreatedAt?: string | null
          quotationId?: string | null
          registrationFee?: number | null
          vehicleType?: string | null
        }
        Update: {
          additionalCollision?: boolean | null
          additionalGlassProtection?: boolean | null
          coupon?: string | null
          created_at?: string
          discount?: number | null
          discountRecurrentFor?: number | null
          fipe?: string | null
          firstPaymentPrice?: number | null
          id?: string
          isServiceVehicle?: boolean | null
          monthlyPrice?: number | null
          phone?: string
          plate?: string | null
          priceWithoutDiscount?: number | null
          quotationCreatedAt?: string | null
          quotationId?: string | null
          registrationFee?: number | null
          vehicleType?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_quotations_phone_fkey"
            columns: ["phone"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["phone"]
          },
        ]
      }
      awaiting_ai_response: {
        Row: {
          channel_id: string | null
          contact_id: string | null
          created_at: string
          id: number
          message_buffer: string | null
          user_phone_br: string
          user_phone_gallabox: string | null
        }
        Insert: {
          channel_id?: string | null
          contact_id?: string | null
          created_at?: string
          id?: number
          message_buffer?: string | null
          user_phone_br: string
          user_phone_gallabox?: string | null
        }
        Update: {
          channel_id?: string | null
          contact_id?: string | null
          created_at?: string
          id?: number
          message_buffer?: string | null
          user_phone_br?: string
          user_phone_gallabox?: string | null
        }
        Relationships: []
      }
      distribution: {
        Row: {
          attendant: string | null
          created_at: string
          gallabox_assignee_id: string | null
          gallabox_channel_id: string | null
          gallabox_contact_id: string
          gallabox_last_conversation_id: string | null
          gallabox_team_id: string | null
          id: number
          opt_out: boolean
          phone_br: string
          phone_gallabox: string
        }
        Insert: {
          attendant?: string | null
          created_at?: string
          gallabox_assignee_id?: string | null
          gallabox_channel_id?: string | null
          gallabox_contact_id: string
          gallabox_last_conversation_id?: string | null
          gallabox_team_id?: string | null
          id?: number
          opt_out?: boolean
          phone_br: string
          phone_gallabox: string
        }
        Update: {
          attendant?: string | null
          created_at?: string
          gallabox_assignee_id?: string | null
          gallabox_channel_id?: string | null
          gallabox_contact_id?: string
          gallabox_last_conversation_id?: string | null
          gallabox_team_id?: string | null
          id?: number
          opt_out?: boolean
          phone_br?: string
          phone_gallabox?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      global_prompts: {
        Row: {
          connect_into: string
          connected_agent_id: string[] | null
          created_at: string
          id: number
          name: string | null
          prompt: string | null
          prompt_id: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          connect_into?: string
          connected_agent_id?: string[] | null
          created_at?: string
          id?: number
          name?: string | null
          prompt?: string | null
          prompt_id: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          connect_into?: string
          connected_agent_id?: string[] | null
          created_at?: string
          id?: number
          name?: string | null
          prompt?: string | null
          prompt_id?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      global_prompts_v4: {
        Row: {
          created_at: string
          edited_by_email: string | null
          id: number
          prompt_desc: string | null
          prompt_hml: string | null
          prompt_id: string
          prompt_name: string | null
          prompt_prd: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          edited_by_email?: string | null
          id?: number
          prompt_desc?: string | null
          prompt_hml?: string | null
          prompt_id: string
          prompt_name?: string | null
          prompt_prd?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          edited_by_email?: string | null
          id?: number
          prompt_desc?: string | null
          prompt_hml?: string | null
          prompt_id?: string
          prompt_name?: string | null
          prompt_prd?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      loovi_knowledge_base: {
        Row: {
          embedding: string | null
          id: number
          metadata: Json | null
          vector_id: string
        }
        Insert: {
          embedding?: string | null
          id?: number
          metadata?: Json | null
          vector_id: string
        }
        Update: {
          embedding?: string | null
          id?: number
          metadata?: Json | null
          vector_id?: string
        }
        Relationships: []
      }
      mastra_evals: {
        Row: {
          agent_name: string
          created_at: string
          created_atZ: string | null
          createdAt: string | null
          createdAtZ: string | null
          global_run_id: string
          input: string
          instructions: string
          metric_name: string
          output: string
          result: Json
          run_id: string
          test_info: Json | null
        }
        Insert: {
          agent_name: string
          created_at: string
          created_atZ?: string | null
          createdAt?: string | null
          createdAtZ?: string | null
          global_run_id: string
          input: string
          instructions: string
          metric_name: string
          output: string
          result: Json
          run_id: string
          test_info?: Json | null
        }
        Update: {
          agent_name?: string
          created_at?: string
          created_atZ?: string | null
          createdAt?: string | null
          createdAtZ?: string | null
          global_run_id?: string
          input?: string
          instructions?: string
          metric_name?: string
          output?: string
          result?: Json
          run_id?: string
          test_info?: Json | null
        }
        Relationships: []
      }
      mastra_messages: {
        Row: {
          content: string
          createdAt: string
          createdAtZ: string | null
          id: string
          resourceId: string | null
          role: string
          thread_id: string
          type: string
        }
        Insert: {
          content: string
          createdAt: string
          createdAtZ?: string | null
          id: string
          resourceId?: string | null
          role: string
          thread_id: string
          type: string
        }
        Update: {
          content?: string
          createdAt?: string
          createdAtZ?: string | null
          id?: string
          resourceId?: string | null
          role?: string
          thread_id?: string
          type?: string
        }
        Relationships: []
      }
      mastra_resources: {
        Row: {
          createdAt: string
          createdAtZ: string | null
          id: string
          metadata: Json | null
          updatedAt: string
          updatedAtZ: string | null
          workingMemory: string | null
        }
        Insert: {
          createdAt: string
          createdAtZ?: string | null
          id: string
          metadata?: Json | null
          updatedAt: string
          updatedAtZ?: string | null
          workingMemory?: string | null
        }
        Update: {
          createdAt?: string
          createdAtZ?: string | null
          id?: string
          metadata?: Json | null
          updatedAt?: string
          updatedAtZ?: string | null
          workingMemory?: string | null
        }
        Relationships: []
      }
      mastra_scorers: {
        Row: {
          additionalContext: Json | null
          analyzePrompt: string | null
          analyzeStepResult: Json | null
          createdAt: string
          createdAtZ: string | null
          entity: Json | null
          entityId: string | null
          entityType: string | null
          extractPrompt: string | null
          extractStepResult: Json | null
          id: string
          input: Json
          metadata: Json | null
          output: Json
          reason: string | null
          reasonPrompt: string | null
          resourceId: string | null
          runId: string
          runtimeContext: Json | null
          score: number
          scorer: Json
          scorerId: string
          source: string
          threadId: string | null
          traceId: string | null
          updatedAt: string
          updatedAtZ: string | null
        }
        Insert: {
          additionalContext?: Json | null
          analyzePrompt?: string | null
          analyzeStepResult?: Json | null
          createdAt: string
          createdAtZ?: string | null
          entity?: Json | null
          entityId?: string | null
          entityType?: string | null
          extractPrompt?: string | null
          extractStepResult?: Json | null
          id: string
          input: Json
          metadata?: Json | null
          output: Json
          reason?: string | null
          reasonPrompt?: string | null
          resourceId?: string | null
          runId: string
          runtimeContext?: Json | null
          score: number
          scorer: Json
          scorerId: string
          source: string
          threadId?: string | null
          traceId?: string | null
          updatedAt: string
          updatedAtZ?: string | null
        }
        Update: {
          additionalContext?: Json | null
          analyzePrompt?: string | null
          analyzeStepResult?: Json | null
          createdAt?: string
          createdAtZ?: string | null
          entity?: Json | null
          entityId?: string | null
          entityType?: string | null
          extractPrompt?: string | null
          extractStepResult?: Json | null
          id?: string
          input?: Json
          metadata?: Json | null
          output?: Json
          reason?: string | null
          reasonPrompt?: string | null
          resourceId?: string | null
          runId?: string
          runtimeContext?: Json | null
          score?: number
          scorer?: Json
          scorerId?: string
          source?: string
          threadId?: string | null
          traceId?: string | null
          updatedAt?: string
          updatedAtZ?: string | null
        }
        Relationships: []
      }
      mastra_threads: {
        Row: {
          createdAt: string
          createdAtZ: string | null
          id: string
          metadata: string | null
          resourceId: string
          title: string
          updatedAt: string
          updatedAtZ: string | null
        }
        Insert: {
          createdAt: string
          createdAtZ?: string | null
          id: string
          metadata?: string | null
          resourceId: string
          title: string
          updatedAt: string
          updatedAtZ?: string | null
        }
        Update: {
          createdAt?: string
          createdAtZ?: string | null
          id?: string
          metadata?: string | null
          resourceId?: string
          title?: string
          updatedAt?: string
          updatedAtZ?: string | null
        }
        Relationships: []
      }
      mastra_traces: {
        Row: {
          attributes: Json | null
          createdAt: string
          createdAtZ: string | null
          endTime: number
          events: Json | null
          id: string
          kind: number
          links: Json | null
          name: string
          other: string | null
          parentSpanId: string | null
          scope: string
          startTime: number
          status: Json | null
          traceId: string
        }
        Insert: {
          attributes?: Json | null
          createdAt: string
          createdAtZ?: string | null
          endTime: number
          events?: Json | null
          id: string
          kind: number
          links?: Json | null
          name: string
          other?: string | null
          parentSpanId?: string | null
          scope: string
          startTime: number
          status?: Json | null
          traceId: string
        }
        Update: {
          attributes?: Json | null
          createdAt?: string
          createdAtZ?: string | null
          endTime?: number
          events?: Json | null
          id?: string
          kind?: number
          links?: Json | null
          name?: string
          other?: string | null
          parentSpanId?: string | null
          scope?: string
          startTime?: number
          status?: Json | null
          traceId?: string
        }
        Relationships: []
      }
      mastra_workflow_snapshot: {
        Row: {
          createdAt: string
          createdAtZ: string | null
          resourceId: string | null
          run_id: string
          snapshot: string
          updatedAt: string
          updatedAtZ: string | null
          workflow_name: string
        }
        Insert: {
          createdAt: string
          createdAtZ?: string | null
          resourceId?: string | null
          run_id: string
          snapshot: string
          updatedAt: string
          updatedAtZ?: string | null
          workflow_name: string
        }
        Update: {
          createdAt?: string
          createdAtZ?: string | null
          resourceId?: string | null
          run_id?: string
          snapshot?: string
          updatedAt?: string
          updatedAtZ?: string | null
          workflow_name?: string
        }
        Relationships: []
      }
      plates: {
        Row: {
          brand: string | null
          chassis: string | null
          created_at: string
          fipeSap: string | null
          fipeString: string | null
          fuel: string | null
          id: number
          isAllowed: boolean
          model: string | null
          modelYear: number | null
          passengers: number | null
          phone: string | null
          plate: string
          type: string | null
          year: number | null
        }
        Insert: {
          brand?: string | null
          chassis?: string | null
          created_at?: string
          fipeSap?: string | null
          fipeString?: string | null
          fuel?: string | null
          id?: number
          isAllowed: boolean
          model?: string | null
          modelYear?: number | null
          passengers?: number | null
          phone?: string | null
          plate: string
          type?: string | null
          year?: number | null
        }
        Update: {
          brand?: string | null
          chassis?: string | null
          created_at?: string
          fipeSap?: string | null
          fipeString?: string | null
          fuel?: string | null
          id?: number
          isAllowed?: boolean
          model?: string | null
          modelYear?: number | null
          passengers?: number | null
          phone?: string | null
          plate?: string
          type?: string | null
          year?: number | null
        }
        Relationships: []
      }
      users: {
        Row: {
          cep: string | null
          chosen_plan: string | null
          city: string | null
          conversation_id: string | null
          cpf: string | null
          created_at: string
          ctwa_clid: string | null
          district: string | null
          email: string | null
          fipe_range: string | null
          gallabox_assignee: string | null
          generated_quotation_ids: string[] | null
          has_contract: boolean | null
          ibge_code: string | null
          id: string
          name: string | null
          phone: string
          phone_gallabox: string | null
          plate: string | null
          resource_id: string | null
          state_uf: string | null
          street: string | null
          street_number: string | null
          updated_at: string | null
          user_id: string | null
          vehicle: Json | null
        }
        Insert: {
          cep?: string | null
          chosen_plan?: string | null
          city?: string | null
          conversation_id?: string | null
          cpf?: string | null
          created_at?: string
          ctwa_clid?: string | null
          district?: string | null
          email?: string | null
          fipe_range?: string | null
          gallabox_assignee?: string | null
          generated_quotation_ids?: string[] | null
          has_contract?: boolean | null
          ibge_code?: string | null
          id?: string
          name?: string | null
          phone: string
          phone_gallabox?: string | null
          plate?: string | null
          resource_id?: string | null
          state_uf?: string | null
          street?: string | null
          street_number?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle?: Json | null
        }
        Update: {
          cep?: string | null
          chosen_plan?: string | null
          city?: string | null
          conversation_id?: string | null
          cpf?: string | null
          created_at?: string
          ctwa_clid?: string | null
          district?: string | null
          email?: string | null
          fipe_range?: string | null
          gallabox_assignee?: string | null
          generated_quotation_ids?: string[] | null
          has_contract?: boolean | null
          ibge_code?: string | null
          id?: string
          name?: string | null
          phone?: string
          phone_gallabox?: string | null
          plate?: string | null
          resource_id?: string | null
          state_uf?: string | null
          street?: string | null
          street_number?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle?: Json | null
        }
        Relationships: []
      }
      wpp_template_sent: {
        Row: {
          answered: boolean
          created_at: string
          id: number
          phone: string
          template_id: string
          template_name: string
        }
        Insert: {
          answered?: boolean
          created_at?: string
          id?: number
          phone: string
          template_id: string
          template_name: string
        }
        Update: {
          answered?: boolean
          created_at?: string
          id?: number
          phone?: string
          template_id?: string
          template_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
