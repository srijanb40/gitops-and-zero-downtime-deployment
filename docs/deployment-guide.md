## Deployment commands
Install Argo CD in your lab cluster if it is not already installed:

```bash
$ kubectl create namespace argocd

$ kubectl apply -n argocd \
  -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Apply the Argo CD project:

```bash
$ kubectl apply -f argocd/project.yaml
```

Deploy the development application:

```bash
$ kubectl apply -f argocd/application-dev.yaml
```

Check application status:

```bash
$ kubectl get applications -n argocd
$ argocd app get demo-app-dev
$ argocd app sync demo-app-dev
```

Check Kubernetes workloads:

```bash
$ kubectl get pods -n demo-dev
$ kubectl get svc -n demo-dev
$ kubectl get events -n demo-dev \
  --sort-by=.metadata.creationTimestamp
```

Validate the Helm chart locally:
```bash
$ helm lint helm/demo-app
$ helm template demo-app helm/demo-app -f helm/demo-app/values-dev.yaml
```