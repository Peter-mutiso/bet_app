/**import { ApiClient } from "./client";

export interface AuthUser {
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly roles: readonly string[];
}

export interface LoginRequest {
  readonly email: string;
  readonly password: string;
  readonly remember?: boolean;
}

export interface RegisterRequest {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
}

export interface AuthResponse {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly user: AuthUser;
}

export interface AuthConfiguration {
  readonly rememberSession: boolean;
}

export interface AuthMetrics {
  logins: number;
  logouts: number;
  registrations: number;
  refreshes: number;
}

export class AuthService {
  private currentUser?: AuthUser;
  private accessToken?: string;
  private refreshToken?: string;

  private readonly metrics: AuthMetrics = {
    logins: 0,
    logouts: 0,
    registrations: 0,
    refreshes: 0,
  };

  constructor(
    private readonly api: ApiClient,
    private readonly configuration: AuthConfiguration
  ) {}

  public async login(request: LoginRequest) {
    const response =
      await this.api.post<AuthResponse, LoginRequest>(
        "/auth/login",
        request
      );

    this.restore(response.data);
    this.metrics.logins++;

    return this.currentUser!;
  }

  public async register(request: RegisterRequest) {
    const response =
      await this.api.post<AuthResponse, RegisterRequest>(
        "/auth/register",
        request
      );

    this.restore(response.data);
    this.metrics.registrations++;

    return this.currentUser!;
  }

  public async logout() {
    try {
      await this.api.post("/auth/logout", {});
    } finally {
      this.currentUser = undefined;
      this.accessToken = undefined;
      this.refreshToken = undefined;

      this.api.clearAuthorization();

      this.metrics.logouts++;
    }
  }

  public user() {
    return this.currentUser;
  }

  public authenticated() {
    return (
      this.currentUser !== undefined &&
      this.accessToken !== undefined
    );
  }

  public token() {
    return this.accessToken;
  }

  public restore(response: AuthResponse) {
    this.accessToken = response.accessToken;
    this.refreshToken = response.refreshToken;
    this.currentUser = response.user;

    this.api.setAuthorization(response.accessToken);
  }

  public async refresh() {
    if (!this.refreshToken) {
      throw new Error("No refresh token available.");
    }

    const response =
      await this.api.post<
        AuthResponse,
        { refreshToken: string }
      >(
        "/auth/refresh",
        {
          refreshToken: this.refreshToken,
        }
      );

    this.restore(response.data);

    this.metrics.refreshes++;
  }

  public async forgotPassword(email: string) {
    await this.api.post<
      void,
      { email: string }
    >(
      "/auth/forgot-password",
      {
        email,
      }
    );
  }

  public async resetPassword(
    token: string,
    password: string
  ) {
    await this.api.post<
      void,
      {
        token: string;
        password: string;
      }
    >(
      "/auth/reset-password",
      {
        token,
        password,
      }
    );
  }

  public async verifyEmail(token: string) {
    await this.api.post<
      void,
      { token: string }
    >(
      "/auth/verify-email",
      {
        token,
      }
    );
  }

  public hasRole(role: string) {
    return this.currentUser?.roles.includes(role) ?? false;
  }

  public hasAnyRole(...roles: string[]) {
    return roles.some(
      (role) => this.hasRole(role)
    );
  }

  public statistics(): Readonly<AuthMetrics> {
    return Object.freeze({
      ...this.metrics,
    });
  }

  public settings(): Readonly<AuthConfiguration> {
    return Object.freeze({
      ...this.configuration,
    });
  }

  public healthy() {
    return this.authenticated();
  }

  public information(): Readonly<Record<string, unknown>> {
    return Object.freeze({
      authenticated: this.authenticated(),
      user: this.currentUser,
      hasAccessToken: this.accessToken !== undefined,
      hasRefreshToken: this.refreshToken !== undefined,
      rememberSession: this.configuration.rememberSession,
      metrics: this.statistics(),
    });
  }

  public diagnostics() {
    return Object.freeze({
      healthy: this.healthy(),
      information: this.information(),
    });
  }

  public reset() {
    this.currentUser = undefined;
    this.accessToken = undefined;
    this.refreshToken = undefined;

    this.api.clearAuthorization();

    this.metrics.logins = 0;
    this.metrics.logouts = 0;
    this.metrics.registrations = 0;
    this.metrics.refreshes = 0;
  }

  public destroy() {
    this.reset();
  }
}

export function createAuthService(
  api: ApiClient,
  configuration: AuthConfiguration
) {
  return new AuthService(
    api,
    configuration
  );
}**/

// services/api/auth.ts
import { ApiClient } from "./client";

export interface AuthUser {
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly roles: readonly string[];
}

export interface LoginRequest {
  readonly email: string;
  readonly password: string;
  readonly remember?: boolean;
}

export interface RegisterRequest {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
}

export interface AuthResponse {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly user: AuthUser;
}

interface StoredUser extends AuthUser {
  password: string;
}

export class AuthService {
  private currentUser?: AuthUser;

  constructor(
    private readonly api: ApiClient,
    private readonly configuration:{rememberSession:boolean}
  ){
    this.restoreSession();
  }

  private users():StoredUser[]{
    if(typeof window==="undefined") return [];
    return JSON.parse(localStorage.getItem("demoUsers")||"[]");
  }

  private saveUsers(users:StoredUser[]){
    localStorage.setItem("demoUsers",JSON.stringify(users));
  }

  private restoreSession(){
    if(typeof window==="undefined") return;
    const s=localStorage.getItem("demoSession");
    if(s) this.currentUser=JSON.parse(s);
  }

  public async register(r:RegisterRequest){
    const users=this.users();
    if(users.find(u=>u.email.toLowerCase()===r.email.toLowerCase())){
      throw new Error("An account with this email already exists.");
    }
    const user:StoredUser={
      id:crypto.randomUUID(),
      username:r.username,
      email:r.email,
      firstName:r.firstName,
      lastName:r.lastName,
      roles:["user"],
      password:r.password
    };
    users.push(user);
    this.saveUsers(users);
    return user;
  }

  public async login(r:LoginRequest){
    const u=this.users().find(x=>x.email.toLowerCase()===r.email.toLowerCase());
    if(!u) throw new Error("No account found. Please register first.");
    if(u.password!==r.password) throw new Error("Incorrect email or password.");
    const {password,...authUser}=u;
    this.currentUser=authUser;
    localStorage.setItem("demoSession",JSON.stringify(authUser));
    return authUser;
  }

  public async logout(){
    this.currentUser=undefined;
    localStorage.removeItem("demoSession");
  }

  public async refresh(){ this.restoreSession(); }
  public user(){ return this.currentUser; }
  public authenticated(){ return !!this.currentUser; }
  public hasRole(role:string){ return this.currentUser?.roles.includes(role)??false; }
  public hasAnyRole(...roles:string[]){ return roles.some(r=>this.hasRole(r)); }
 public async forgotPassword(email: string): Promise<void> {
    const user = this.users().find(
        u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
        throw new Error("No account found with that email address.");
    }

    // Demo implementation
    console.log(`Password reset requested for ${email}`);

    return Promise.resolve();
}

public async resetPassword(
    token: string,
    newPassword: string
): Promise<void> {

    // Demo implementation
    console.log("Reset token:", token);
    console.log("New password:", newPassword);

    return Promise.resolve();
}

public async verifyEmail(
    token: string
): Promise<void> {

    // Demo implementation
    console.log("Verify email token:", token);

    return Promise.resolve();
}
  public healthy(){ return true; }
  public information(){ return {}; }
  public diagnostics(){ return {}; }
  public reset(){ this.currentUser=undefined; localStorage.removeItem("demoSession");}
  public destroy(){ this.reset(); }
}

export function createAuthService(api:ApiClient,configuration:{rememberSession:boolean}){
  return new AuthService(api,configuration);
}
