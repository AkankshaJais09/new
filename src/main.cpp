#include <iostream>
#include <vector>
#include <climits>
using namespace std;
struct Process {
    int pid;
    int arrivalTime;
    int burstTime;
    int priority;
    int waitingTime;
    int turnaroundTime;
};
int main() {
    int n;
    cout << "Enter number of processes: ";
    cin >> n;

    vector<Process> processes(n);
    for (int i = 0; i < n; ++i) {
        processes[i].pid = i + 1;
        cout << "Enter arrival time of process " << i + 1 << ": ";
        cin >> processes[i].arrivalTime;
        cout << "Enter burst time of process " << i + 1 << ": ";
        cin >> processes[i].burstTime;
        cout << "Enter priority of process " << i + 1 << " (lower value = higher priority): ";
        cin >> processes[i].priority;
    }
    int currentTime = 0;
    int completed = 0;
    vector<bool> isCompleted(n, false);

    while (completed != n) {
        int idx = -1;
        int minBurst = INT_MAX;
        int highestPriority = INT_MAX;

        for (int i = 0; i < n; ++i) {
            if (!isCompleted[i] && processes[i].arrivalTime <= currentTime) {
                if (processes[i].burstTime < minBurst || 
                   (processes[i].burstTime == minBurst && processes[i].priority < highestPriority)) {
                    minBurst = processes[i].burstTime;
                    highestPriority = processes[i].priority;
                    idx = i;
                }
            }
        }

        if (idx != -1) {
            processes[idx].waitingTime = currentTime - processes[idx].arrivalTime;
            currentTime += processes[idx].burstTime;
            processes[idx].turnaroundTime = processes[idx].waitingTime + processes[idx].burstTime;
            isCompleted[idx] = true;
            completed++;
        } else {
            currentTime++; 
        }
    }
    cout << "\nPID\tAT\tBT\tPR\tWT\tTAT\n";
    for (const auto& p : processes) {
        cout << p.pid << "\t" << p.arrivalTime << "\t" << p.burstTime << "\t"
             << p.priority << "\t" << p.waitingTime << "\t" << p.turnaroundTime << endl;
    }

    return 0;
}
