import Match from "../entities/Match";
import { Role } from "../enums/Role";
import { PermissionGroupName } from "../enums/PermissionGroup";

export default class ProfileViewModel {
    alias: string;
    steamid: string;
    avatar: string;
    subsIn: number;
    subsOut: number;
    wins: HLPugs.TFClassesTracker;
    losses: HLPugs.TFClassesTracker;
    ties: HLPugs.TFClassesTracker;
    isCaptain: boolean;
    permissionGroup: PermissionGroupName;
    roles: Role[];
    paginatedMatches: Match[];
}