import { GroupMembershipStatistic } from "../../schemas";

export interface IGetGroupMembershipStatisticOutput {
  groupMembershipId: string;
  data: GroupMembershipStatistic[];
}
