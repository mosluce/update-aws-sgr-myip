import {
  EC2Client,
  ModifySecurityGroupRulesCommand,
} from "@aws-sdk/client-ec2";
import { Command, flags } from "@oclif/command";
import axios from "axios";

const ec2 = new EC2Client({});

class UpdateAwsSgrMyip extends Command {
  static description = "update myip to aws security group rule";

  static flags = {
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
    "security-group-id": flags.string({ char: "g", required: true }),
    "secutity-group-rule-id": flags.string({ char: "r", required: true }),
    port: flags.integer({ char: "p", required: true }),
    protocol: flags.string({ default: "tcp" }),
    description: flags.string({
      default: "update by npm update-aws-sgr-myip",
    }),
  };

  static args = [{ name: "file" }];

  async run() {
    const { args, flags } = this.parse(UpdateAwsSgrMyip);

    const { data } = await axios.get("https://checkip.amazonaws.com/");
    const myip = data.trim();

    const GroupId = flags["security-group-id"];
    const SecurityGroupRuleId = flags["secutity-group-rule-id"];
    const Port = flags.port;
    const IpProtocol = flags.protocol;
    const Description = flags.description;
    const CidrIpv4 = `${myip}/32`;

    await ec2.send(
      new ModifySecurityGroupRulesCommand({
        GroupId,
        SecurityGroupRules: [
          {
            SecurityGroupRuleId,
            SecurityGroupRule: {
              CidrIpv4,
              Description,
              FromPort: Port,
              ToPort: Port,
              IpProtocol,
            },
          },
        ],
      })
    );
  }
}

export = UpdateAwsSgrMyip;
