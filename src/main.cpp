#include <iostream>
#include <vector>
#include <algorithm>
#include <iomanip>
using namespace std;

struct Process {
    int pid;
    int arrivalTime;
    int burstTime;
    int priority;
    int waitingTime;
    int turnaroundTime;
};

bool compareArrival(const Process &a, const Process &b) {
    return a.arrivalTime < b.arrivalTime;
}

bool compareBurstThenPriority(const Process &a, const Process &b) {
    if (a.burstTime == b.burstTime)
        return a.priority < b.priority;
    return a.burstTime < b.burstTime;
}

int main() {
    int n;
    cout << "Enter the number of processes: ";
    cin >> n;

    vector<Process> processes(n);

    for (int i = 0; i < n; ++i) {
        processes[i].pid = i + 1;
        cout << "Enter Arrival Time, Burst Time, and Priority for Process " << i + 1 << ": ";
        cin >> processes[i].arrivalTime >> processes[i].burstTime >> processes[i].priority;
    }

    sort(processes.begin(), processes.end(), compareArrival);

    int currentTime = 0;
    vector<Process> completed;
    vector<bool> isCompleted(n, false);
    int completedCount = 0;

    while (completedCount < n) {
        vector<Process> readyQueue;

        for (int i = 0; i < n; ++i) {
            if (!isCompleted[i] && processes[i].arrivalTime <= currentTime) {
                readyQueue.push_back(processes[i]);
            }
        }

        if (readyQueue.empty()) {
            currentTime++;
            continue;
        }

        sort(readyQueue.begin(), readyQueue.end(), compareBurstThenPriority);

        Process currentProcess = readyQueue[0];

        int index = -1;
        for (int i = 0; i < n; ++i) {
            if (!isCompleted[i] && processes[i].pid == currentProcess.pid) {
                index = i;
                break;
            }
        }

        currentTime += processes[index].burstTime;
        processes[index].turnaroundTime = currentTime - processes[index].arrivalTime;
        processes[index].waitingTime = processes[index].turnaroundTime - processes[index].burstTime;

        isCompleted[index] = true;
        completed.push_back(processes[index]);
        completedCount++;
    }

    float totalWT = 0, totalTAT = 0, totalEnergy = 0;

    cout << "\nPID\tAT\tBT\tPR\tWT\tTAT\tEnergy\n";
    for (const auto &p : completed) {
        float energy = p.burstTime * p.priority * 0.5;
        totalWT += p.waitingTime;
        totalTAT += p.turnaroundTime;
        totalEnergy += energy;

        cout << p.pid << "\t" << p.arrivalTime << "\t" << p.burstTime << "\t"
             << p.priority << "\t" << p.waitingTime << "\t" << p.turnaroundTime << "\t"
             << fixed << setprecision(2) << energy << "\n";
    }

    cout << "\nAverage Waiting Time: " << fixed << setprecision(2) << totalWT / n;
    cout << "\nAverage Turnaround Time: " << fixed << setprecision(2) << totalTAT / n;
    cout << "\nTotal Energy Consumed: " << fixed << setprecision(2) << totalEnergy << "\n";

    return 0;
}
