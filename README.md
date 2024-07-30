# temporal-infra-provisioning-demo

| Prerequisites      |   | Features       |   | Patterns            |   |
|:-------------------|---|----------------|---|---------------------|---|
| Network Connection |   | Schedule       |   | Entity              |   |
|                    |   | Local Activity | ✅ | Long-Running       | ✅ |
| Python 3.12        | ✅ | Timer         |    | Fanout              |   |
| Poetry 1.8.3       | ✅ | Signal        | ✅ | Continue As New     |   |
|                    |   | Query          | ✅ | Manual Intervention | ✅ |
|                    |   | Heartbeat      |    | Long-polling        |   |
|                    |   | Retry          | ✅ |                     |   |
|                    |   | Data Converter |    |                     |   |
|                    |   | Polyglot       |    |                     |   |

```bash
# authenticate your session
tcld login
# generate an API Key
tcld apikey create -n "terraform-test" --desc "Testing the API Key for the TF Provider" -d 90d
```

```bash
# replace <yoursecretkey> with the "secretKey": output from tcld apikey create command
export TEMPORAL_CLOUD_API_KEY=""
```

```bash
export TEMPORAL_HOST_URL=""
export TEMPORAL_MTLS_TLS_CERT=""
export TEMPORAL_MTLS_TLS_KEY=""
export TEMPORAL_NAMESPACE=""
export TEMPORAL_TASK_QUEUE=""
```

## Provision Workflow

### Provision Activities

- Load State for Account
- Terraform Init
- Terraform Plan (tail logs)
- Evaluate Policy
- Terraform Apply (only after approval, tail logs)
- Archive State for Account

### Provision Signals

- Human Approval
- Human Denial

### Provision Queries

- Get Progress

## Destroy Workflow

### Destroy Activities

- Load State for Account
- Terraform Init
- Terraform Destroy (only after approval, tail logs)
- Archive State for Account

### Destroy Signals

- Human Approval

### Destroy Queries

- Get Progress

## TODO

- CLEAR TODOs
- Use Poetry or document `venv`
- Default arguments / config
- Switch to Temporal logging, use more useful messages
- Implement in GH actions, use persistence across runs (are there versions of state?)
- Failure conditions
- Destroy workflow
- Review all the types that I'm using w/ modern Python
- Terraform apply is synchronous for the most part?
- Get certs for the runs from a local Vault instance? Generate with TF?

## Ideas

- Public Module Registry
- Ephemeral Infrastructure (teardown after set period of time unless signaled to keep alive from)
- CDK TF Python?
- Use local activities for terraform stuff and normal activities for API checks?
- Compensations?

## Notes

- Setting the insecure flag in the TF config led to an irrecoverable HTTP/2 error.
